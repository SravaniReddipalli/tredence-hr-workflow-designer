import type { NodeProps } from '@xyflow/react';
import type { WorkflowNode } from '../types/workflow';
import { BaseNode } from './BaseNode';
import { Settings2 } from 'lucide-react';

export function AutomatedStepNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      title="Automated Step"
      icon={<Settings2 size={18} />}
      headerColor="bg-amber-600"
      executing={data.executing}
      completed={data.completed}
      error={data.error}
    >
      <div className="text-sm">
        <p className="font-medium text-gray-800">{data.label || 'System Action'}</p>
        <div className="mt-2 group">
          {data.automationId ? (
            <p className="text-xs text-gray-600 bg-gray-50 p-2 border border-gray-100 rounded break-all">
              ID: {data.automationId}
            </p>
          ) : (
            <p className="text-xs text-amber-600 font-medium">Configuration Required</p>
          )}
        </div>
      </div>
    </BaseNode>
  );
}
