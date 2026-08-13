import type { WorkflowNode, WorkflowEdge, ValidationIssue } from '../types/workflow';

export const validateWorkflowGraph = (nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  const startNodes = nodes.filter(n => n.type === 'startNode');
  const endNodes = nodes.filter(n => n.type === 'endNode');
  
  if (startNodes.length === 0) {
    issues.push({ message: 'Workflow must have at least one Start node.', type: 'error' });
  } else if (startNodes.length > 1) {
    issues.push({ message: 'Workflow should only have one Start node.', type: 'warning' });
  }

  if (endNodes.length === 0) {
    issues.push({ message: 'Workflow should have at least one End node.', type: 'warning' });
  }

  nodes.forEach(node => {
    // Check specific node requirements
    if (node.type === 'taskNode' && !node.data.assignee) {
      issues.push({ nodeId: node.id, message: `Task "${node.data.label}" lacks an assignee.`, type: 'warning' });
    }
    if (node.type === 'approvalNode' && !node.data.approver) {
      issues.push({ nodeId: node.id, message: `Approval "${node.data.label}" lacks an approver.`, type: 'error' });
    }
    if (node.type === 'automatedNode' && !node.data.automationId) {
      issues.push({ nodeId: node.id, message: `Automated node "${node.data.label}" has no automation selected.`, type: 'error' });
    }
  });

  // Cycle Detection (simple DFS)
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach(n => adjacencyList.set(n.id, []));
  edges.forEach(e => {
    const list = adjacencyList.get(e.source);
    if (list) list.push(e.target);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  let hasCycle = false;

  const isCyclic = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && isCyclic(neighbor)) {
        return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }
    recursionStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (isCyclic(node.id)) {
        hasCycle = true;
        break;
      }
    }
  }

  if (hasCycle) {
    issues.push({ message: 'Workflow contains a cycle, which is not allowed.', type: 'error' });
  }

  // Reachability: check if all nodes have edges (except if there is only 1 node)
  if (nodes.length > 1) {
    nodes.forEach(node => {
      const isSource = edges.some(e => e.source === node.id);
      const isTarget = edges.some(e => e.target === node.id);
      if (!isSource && !isTarget) {
         issues.push({ nodeId: node.id, message: `Node "${node.data.label}" is disconnected.`, type: 'warning' });
      }
    });
  }

  return issues;
};
