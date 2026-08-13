import type { Node, Edge } from '@xyflow/react';

export type WorkflowNodeType = 'startNode' | 'taskNode' | 'approvalNode' | 'automatedNode' | 'endNode';

export interface CustomField {
  id: string;
  key: string;
  value: string;
}

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  
  // Start Node
  triggerEvent?: string;
  
  // Task Node
  assignee?: string;
  customFields?: CustomField[];
  
  // Approval Node
  approver?: string;
  autoApproveThreshold?: number;
  
  // Automated Node
  automationId?: string;
  automationParams?: Record<string, string>;
  
  // End Node
  endMessage?: string;
  showSummary?: boolean;
  
  // Simulation state tracking
  executing?: boolean;
  completed?: boolean;
  error?: string;
}

export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>;
export type WorkflowEdge = Edge;

export interface ValidationIssue {
  nodeId?: string;
  message: string;
  type: 'error' | 'warning';
}

export interface SimulationLogEntry {
  id: string;
  timestamp: Date;
  nodeId: string;
  nodeLabel: string;
  message: string;
  status: 'started' | 'success' | 'failed';
}

export interface AutomationChoice {
  id: string;
  name: string;
  requiredParams: string[];
}
