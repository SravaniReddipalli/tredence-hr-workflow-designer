import { StartNode } from './StartNode';
import { TaskNode } from './TaskNode';
import { ApprovalNode } from './ApprovalNode';
import { AutomatedStepNode } from './AutomatedStepNode';
import { EndNode } from './EndNode';

export const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedStepNode,
  endNode: EndNode,
};
