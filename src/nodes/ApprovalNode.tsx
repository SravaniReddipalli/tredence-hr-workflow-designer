import type { NodeProps } from '@xyflow/react';
import type { WorkflowNode } from '../types/workflow';
import { BaseNode } from './BaseNode';
import { UserCheck } from 'lucide-react';

export function ApprovalNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      title="Approval"
      icon={<UserCheck size={18} />}
      headerColor="bg-indigo-600"
      executing={data.executing}
      completed={data.completed}
      error={data.error}
    >
      <div className="text-sm">
        <p className="font-medium text-gray-800">{data.label || 'Approval Step'}</p>
        <div className="mt-2 flex flex-col gap-1 items-start">
          <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded inline-block border border-indigo-100">
            Approver: {data.approver || 'Unassigned'}
          </div>
          {data.autoApproveThreshold !== undefined && (
            <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded inline-block border border-amber-100">
              Auto-approve: {data.autoApproveThreshold} days
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
}
