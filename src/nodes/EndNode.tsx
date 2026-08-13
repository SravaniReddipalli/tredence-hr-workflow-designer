import type { NodeProps } from '@xyflow/react';
import type { WorkflowNode } from '../types/workflow';
import { BaseNode } from './BaseNode';
import { CheckCircle2 } from 'lucide-react';

export function EndNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      title="End"
      icon={<CheckCircle2 size={18} />}
      headerColor="bg-slate-700"
      type="end"
      executing={data.executing}
      completed={data.completed}
      error={data.error}
    >
      <div className="text-sm">
        <p className="font-medium text-gray-800">{data.label || 'Workflow Complete'}</p>
      </div>
    </BaseNode>
  );
}
