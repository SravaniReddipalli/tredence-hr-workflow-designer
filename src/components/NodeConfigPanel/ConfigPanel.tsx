import type { WorkflowNode } from '../../types/workflow';
import { StartForm, TaskForm, ApprovalForm, AutomatedStepForm, EndForm } from '../../forms/Forms';
import { Settings } from 'lucide-react';

interface ConfigPanelProps {
  selectedNode: WorkflowNode | null;
  updateNodeData: (id: string, data: Partial<WorkflowNode['data']>) => void;
}

export function ConfigPanel({ selectedNode, updateNodeData }: ConfigPanelProps) {
  if (!selectedNode) {
    return (
      <div className="w-80 border-l border-gray-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Settings size={28} />
        </div>
        <h3 className="text-gray-800 font-medium mb-1">No Component Selected</h3>
        <p className="text-sm text-gray-500">Select a node on the canvas to configure its properties.</p>
      </div>
    );
  }

  const renderForm = () => {
    switch (selectedNode.type) {
      case 'startNode': return <StartForm node={selectedNode} updateNode={updateNodeData} />;
      case 'taskNode': return <TaskForm node={selectedNode} updateNode={updateNodeData} />;
      case 'approvalNode': return <ApprovalForm node={selectedNode} updateNode={updateNodeData} />;
      case 'automatedNode': return <AutomatedStepForm node={selectedNode} updateNode={updateNodeData} />;
      case 'endNode': return <EndForm node={selectedNode} updateNode={updateNodeData} />;
      default: return <p>Unknown Node Type</p>;
    }
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full shadow-sm">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xs text-gray-500 uppercase tracking-widest font-bold">
          Configuration
        </h2>
        <div className="mt-1 text-sm font-semibold text-gray-800 flex items-center gap-2">
          {selectedNode.data.label as string}
          <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded ml-2">
            ID: {selectedNode.id.substring(0,6)}
          </span>
        </div>
      </div>
      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
        {renderForm()}
      </div>
    </div>
  );
}
