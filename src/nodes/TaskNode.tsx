import type { NodeProps } from '@xyflow/react';
import type { WorkflowNode } from '../types/workflow';
import { BaseNode } from './BaseNode';
import { ClipboardList } from 'lucide-react';

export function TaskNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      title="Task"
      icon={<ClipboardList size={18} />}
      headerColor="bg-blue-600"
      executing={data.executing}
      completed={data.completed}
      error={data.error}
    >
      <div className="text-sm">
        <p className="font-medium text-gray-800">{data.label || 'New Task'}</p>
        {data.assignee && (
          <p className="text-gray-500 text-xs mt-1">Assignee: {data.assignee}</p>
        )}
        {data.customFields && data.customFields.length > 0 && (
          <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-widest font-semibold">
            {data.customFields.length} Forms Fields
          </p>
        )}
      </div>
    </BaseNode>
  );
}
