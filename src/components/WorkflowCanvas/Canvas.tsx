import { useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import type { WorkflowNode, WorkflowNodeType } from '../../types/workflow';
import { nodeTypes } from '../../nodes';
import { v4 as uuidv4 } from 'uuid';

interface CanvasProps {
  nodes: WorkflowNode[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onNodesDelete: any;
  onConnect: any;
  setNodes: any;
  setSelectedNodeId: (id: string | null) => void;
}

function InnerCanvas({ nodes, edges, onNodesChange, onEdgesChange, onNodesDelete, onConnect, setNodes, setSelectedNodeId }: CanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType;
      const label = event.dataTransfer.getData('application/reactflow-label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (!reactFlowWrapper.current) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: WorkflowNode = {
        id: uuidv4(),
        type,
        position,
        data: { label },
      };

      setNodes((nds: WorkflowNode[]) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="flex-1 w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesDelete={onNodesDelete}
        deleteKeyCode={['Backspace', 'Delete']}
        onSelectionChange={(params) => {
           setSelectedNodeId(params.nodes.length > 0 ? params.nodes[0].id : null);
        }}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background color="#d1d5db" gap={16} />
        <Controls showInteractive={false} />
        <MiniMap zoomable pannable nodeColor={(n) => {
          if (n.type === 'startNode') return '#059669';
          if (n.type === 'taskNode') return '#2563eb';
          if (n.type === 'approvalNode') return '#4f46e5';
          if (n.type === 'automatedNode') return '#d97706';
          if (n.type === 'endNode') return '#334155';
          return '#9ca3af';
        }} />
      </ReactFlow>
    </div>
  );
}

export function Canvas(props: CanvasProps) {
  return (
    <div className="flex-1 w-full h-full relative">
        <ReactFlowProvider>
          <div className="w-full h-full">
              <InnerCanvas {...props} />
          </div>
        </ReactFlowProvider>
    </div>
  );
}
