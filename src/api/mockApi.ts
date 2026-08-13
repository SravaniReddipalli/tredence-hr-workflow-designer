import type { AutomationChoice, SimulationLogEntry, WorkflowNode, WorkflowEdge } from '../types/workflow';

const MOCK_AUTOMATIONS: AutomationChoice[] = [
  { id: 'auto_1', name: 'Send Email Notification', requiredParams: ['recipient', 'subject', 'body'] },
  { id: 'auto_2', name: 'Generate PDF Document', requiredParams: ['templateId', 'outputName'] },
  { id: 'auto_3', name: 'Create Jira Ticket', requiredParams: ['projectKey', 'issueType', 'summary'] },
  { id: 'auto_4', name: 'Trigger Webhook', requiredParams: ['url', 'payload'] },
];

export const fetchAutomations = async (): Promise<AutomationChoice[]> => {
  // Simulate network delay
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_AUTOMATIONS), 500));
};

// Simulate step-by-step execution. Yields simulation logs.
export async function* simulateWorkflow(
  nodes: WorkflowNode[], 
  edges: WorkflowEdge[]
): AsyncGenerator<SimulationLogEntry, void, unknown> {
  // Find start node
  const startNode = nodes.find(n => n.type === 'startNode');
  if (!startNode) throw new Error("No Start node found");
  
  let currentNode: WorkflowNode | undefined = startNode;
  const visited = new Set<string>();
  let executionId = 1;

  while (currentNode) {
    if (visited.has(currentNode.id)) {
      yield {
        id: String(executionId++), timestamp: new Date(),
        nodeId: currentNode.id, nodeLabel: currentNode.data.label,
        message: 'Cycle detected during execution, aborting.', status: 'failed'
      };
      break;
    }
    visited.add(currentNode.id);
    
    // Announce start
    yield {
      id: String(executionId++), timestamp: new Date(),
      nodeId: currentNode.id, nodeLabel: currentNode.data.label,
      message: `Executing ${currentNode.data.label}...`, status: 'started'
    };
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let completionMessage = `Completed ${currentNode.data.label}.`;

    if (currentNode.type === 'automatedNode') {
      const autoId = currentNode.data.automationId as string | undefined;
      const params = (currentNode.data.automationParams || {}) as Record<string, string>;
      const automation = MOCK_AUTOMATIONS.find(a => a.id === autoId);
      
      if (automation) {
         let details = `\n\nAction: ${automation.name}`;
         for (const [key, value] of Object.entries(params)) {
           const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
           details += `\n${formattedKey}: ${value || '(not set)'}`;
         }
         details += `\nStatus: Simulated successfully\n\nCompleted ${currentNode.data.label}.`;
         completionMessage = details;
      }
    }

    // Announce success
    yield {
      id: String(executionId++), timestamp: new Date(),
      nodeId: currentNode.id, nodeLabel: currentNode.data.label,
      message: completionMessage, status: 'success'
    };

    if (currentNode.type === 'endNode') {
      break;
    }

    // Find next node (simplify for straight line or approval success path for now)
    const outgoingEdges = edges.filter(e => e.source === currentNode?.id);
    if (outgoingEdges.length === 0) {
      break;
    }
    
    // For now, always take the first edge (if approval, assume approved)
    const nextEdge = outgoingEdges[0];
    currentNode = nodes.find(n => n.id === nextEdge.target);
  }
}
