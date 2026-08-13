import { useCallback, useEffect, useState } from 'react';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Connection, NodeChange, EdgeChange } from '@xyflow/react';
import type { WorkflowNode, WorkflowEdge, ValidationIssue, SimulationLogEntry } from '../types/workflow';
import { validateWorkflowGraph } from '../utils/validation';
import { simulateWorkflow } from '../api/mockApi';

const LOCAL_STORAGE_NODES_KEY = 'hr_workflow_nodes';
const LOCAL_STORAGE_EDGES_KEY = 'hr_workflow_edges';

const getInitialState = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage`, error);
  }
  return fallback;
};

export const useWorkflowState = (initialNodes: WorkflowNode[] = [], initialEdges: WorkflowEdge[] = []) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(() => getInitialState<WorkflowNode[]>(LOCAL_STORAGE_NODES_KEY, initialNodes));
  const [edges, setEdges] = useState<WorkflowEdge[]>(() => getInitialState<WorkflowEdge[]>(LOCAL_STORAGE_EDGES_KEY, initialEdges));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [simulationLogs, setSimulationLogs] = useState<SimulationLogEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    try {
      const nodesToSave = nodes.map(n => {
        // Strip out temporary runtime simulation state
        const { executing, completed, error, ...cleanData } = n.data;
        return { ...n, data: cleanData };
      });
      localStorage.setItem(LOCAL_STORAGE_NODES_KEY, JSON.stringify(nodesToSave));
      localStorage.setItem(LOCAL_STORAGE_EDGES_KEY, JSON.stringify(edges));
    } catch (error) {
      console.error('Error saving workflow state to localStorage', error);
    }
  }, [nodes, edges]);

  const onNodesChange = useCallback((changes: NodeChange<WorkflowNode>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds) as WorkflowNode[]);
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange<WorkflowEdge>[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds) as WorkflowEdge[]);
  }, []);

  const onNodesDelete = useCallback((deleted: WorkflowNode[]) => {
    setEdges((eds) => 
      eds.filter((edge) => !deleted.some((node) => edge.source === node.id || edge.target === node.id))
    );
  }, []);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds) as WorkflowEdge[]);
  }, []);

  const updateNodeData = useCallback((nodeId: string, data: Partial<WorkflowNode['data']>) => {
    setNodes((nds) => 
      nds.map(node => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );
  }, []);

  const validate = useCallback(() => {
    const issues = validateWorkflowGraph(nodes, edges);
    setValidationIssues(issues);
    return issues;
  }, [nodes, edges]);

  const runSimulation = useCallback(async () => {
    const issues = validate();
    if (issues.some(i => i.type === 'error')) {
      return; // Cannot simulate with errors
    }
    
    setIsSimulating(true);
    setSimulationLogs([]);
    
    // reset node simulation state
    setNodes(nds => nds.map(n => ({...n, data: {...n.data, executing: false, completed: false, error: undefined}})));
    
    try {
      for await (const log of simulateWorkflow(nodes, edges)) {
        setSimulationLogs(prev => [...prev, log]);
        
        // highlight executing node
        setNodes(nds => nds.map(n => {
           if (n.id === log.nodeId) {
              return { 
                ...n, 
                data: {
                   ...n.data, 
                   executing: log.status === 'started',
                   completed: log.status === 'success',
                   error: log.status === 'failed' ? log.message : undefined
                }
              };
           }
           return n;
        }));
      }
    } catch (e) {
      setSimulationLogs(prev => [...prev, {
        id: 'err', timestamp: new Date(), nodeId: '', nodeLabel: 'System',
        message: 'Simulation failed: ' + (e as Error).message, status: 'failed'
      }]);
    } finally {
      setIsSimulating(false);
    }
  }, [nodes, edges, validate]);

  return {
    nodes, edges, setNodes, setEdges,
    onNodesChange, onEdgesChange, onConnect, onNodesDelete,
    selectedNodeId, setSelectedNodeId,
    updateNodeData,
    validationIssues, validate,
    simulationLogs, isSimulating, runSimulation
  };
};
