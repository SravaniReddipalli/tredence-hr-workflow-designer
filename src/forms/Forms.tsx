import { useEffect, useState } from 'react';
import type { WorkflowNode, AutomationChoice } from '../types/workflow';
import { DynamicFieldsEditor } from './DynamicFieldsEditor';
import { fetchAutomations } from '../api/mockApi';

interface FormProps {
  node: WorkflowNode;
  updateNode: (id: string, data: Partial<WorkflowNode['data']>) => void;
}

export function StartForm({ node, updateNode }: FormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
        <input 
          type="text" value={node.data.label as string || ''} 
          onChange={(e) => updateNode(node.id, { label: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Event</label>
        <select 
          value={node.data.triggerEvent as string || 'Manual'}
          onChange={(e) => updateNode(node.id, { triggerEvent: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
        >
          <option value="Manual">Manual</option>
          <option value="Employee Hired">Employee Hired</option>
          <option value="Time Off Requested">Time Off Requested</option>
          <option value="Expense Submitted">Expense Submitted</option>
        </select>
      </div>
    </div>
  );
}

export function TaskForm({ node, updateNode }: FormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
        <input 
          type="text" value={node.data.label as string || ''} 
          onChange={(e) => updateNode(node.id, { label: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
        <input 
          type="text" placeholder="e.g. HR Team, John Doe"
          value={node.data.assignee as string || ''} 
          onChange={(e) => updateNode(node.id, { assignee: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <DynamicFieldsEditor 
        fields={node.data.customFields as any} 
        onChange={(fields) => updateNode(node.id, { customFields: fields })} 
      />
    </div>
  );
}

export function ApprovalForm({ node, updateNode }: FormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Approval Step Name</label>
        <input 
          type="text" value={node.data.label as string || ''} 
          onChange={(e) => updateNode(node.id, { label: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Approver</label>
        <input 
          type="text" placeholder="Manager, CEO..."
          value={node.data.approver as string || ''} 
          onChange={(e) => updateNode(node.id, { approver: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Auto-approve Threshold (days)</label>
        <input 
          type="number" min="0" placeholder="e.g. 5"
          value={node.data.autoApproveThreshold as number || ''} 
          onChange={(e) => updateNode(node.id, { autoApproveThreshold: e.target.value ? parseInt(e.target.value, 10) : undefined })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
    </div>
  );
}

export function AutomatedStepForm({ node, updateNode }: FormProps) {
  const [automations, setAutomations] = useState<AutomationChoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomations().then(data => {
      setAutomations(data);
      setLoading(false);
    });
  }, []);

  const selectedAutomation = automations.find(a => a.id === node.data.automationId);
  const currentParams = (node.data.automationParams || {}) as Record<string, string>;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Step Name</label>
        <input 
          type="text" value={node.data.label as string || ''} 
          onChange={(e) => updateNode(node.id, { label: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Action to Automate</label>
        {loading ? (
          <p className="text-sm text-gray-500">Loading actions...</p>
        ) : (
          <select 
            value={node.data.automationId as string || ''}
            onChange={(e) => {
              const id = e.target.value;
              updateNode(node.id, { automationId: id, automationParams: {} });
            }}
            className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
          >
            <option value="">-- Select an Action --</option>
            {automations.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        )}
      </div>

      {selectedAutomation && selectedAutomation.requiredParams.length > 0 && (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
          <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Action Parameters</h4>
          <div className="flex flex-col gap-3">
            {selectedAutomation.requiredParams.map(param => (
              <div key={param}>
                <label className="block text-xs text-gray-600 mb-1">{param}</label>
                <input 
                  type="text" 
                  value={currentParams[param] || ''}
                  onChange={(e) => updateNode(node.id, { 
                    automationParams: { ...currentParams, [param]: e.target.value } 
                  })}
                  className="w-full p-2 border border-gray-300 rounded text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function EndForm({ node, updateNode }: FormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
        <input 
          type="text" value={node.data.label as string || ''} 
          onChange={(e) => updateNode(node.id, { label: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Message</label>
        <textarea
          rows={3}
          value={node.data.endMessage as string || ''}
          onChange={(e) => updateNode(node.id, { endMessage: e.target.value })}
          placeholder="Message to display when workflow finishes"
          className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`summary-${node.id}`}
          checked={!!node.data.showSummary}
          onChange={(e) => updateNode(node.id, { showSummary: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
        <label htmlFor={`summary-${node.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
          Show Workflow Summary
        </label>
      </div>
    </div>
  );
}
