import { PlayCircle, ClipboardList, UserCheck, Settings2, CheckCircle2 } from 'lucide-react';

const NODE_TEMPLATES = [
  { type: 'startNode', label: 'Start', icon: <PlayCircle size={20} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-400', desc: 'Trigger a workflow' },
  { type: 'taskNode', label: 'Task', icon: <ClipboardList size={20} />, color: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400', desc: 'A manual HR task' },
  { type: 'approvalNode', label: 'Approval', icon: <UserCheck size={20} />, color: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:border-indigo-400', desc: 'Requires authorization' },
  { type: 'automatedNode', label: 'Automated Step', icon: <Settings2 size={20} />, color: 'text-amber-600 bg-amber-50 border-amber-200 hover:border-amber-400', desc: 'System executes a script' },
  { type: 'endNode', label: 'End', icon: <CheckCircle2 size={20} />, color: 'text-slate-700 bg-slate-50 border-slate-200 hover:border-slate-400', desc: 'Completes the workflow' }
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-72 border-r border-gray-200 bg-white p-5 flex flex-col h-full shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-10">
      <h2 className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-6">Node Palette</h2>
      <div className="flex flex-col gap-3">
        {NODE_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.type}
            className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-grab active:cursor-grabbing transition-all ${tmpl.color}`}
            onDragStart={(event) => onDragStart(event, tmpl.type, tmpl.label)}
            draggable
          >
            <div className="mt-0.5">{tmpl.icon}</div>
            <div>
              <div className="font-semibold text-sm">{tmpl.label}</div>
              <div className="text-xs opacity-75 mt-0.5">{tmpl.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto bg-gray-50 p-4 rounded-lg border border-gray-100">
         <p className="text-xs text-gray-500 text-center font-medium leading-relaxed">
           Drag and drop nodes onto the canvas to build your workflow.
         </p>
      </div>
    </div>
  );
}
