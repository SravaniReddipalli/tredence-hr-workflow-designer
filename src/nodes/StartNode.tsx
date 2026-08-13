import type { NodeProps } from '@xyflow/react';
import type { WorkflowNode } from '../types/workflow';
import { BaseNode } from './BaseNode';
import { PlayCircle } from 'lucide-react';

export function StartNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      title="Start"
      icon={<PlayCircle size={18} />}
      headerColor="bg-emerald-600"
      type="start"
      executing={data.executing}
      completed={data.completed}
      error={data.error}
    >
      <div className="text-sm">
        <p className="font-medium text-gray-800">{data.label || 'Workflow Trigger'}</p>
        <p className="text-gray-500 text-xs mt-1">
          {data.triggerEvent ? `On: ${data.triggerEvent}` : 'Manual Start'}
        </p>
      </div>
    </BaseNode>
  );
}
