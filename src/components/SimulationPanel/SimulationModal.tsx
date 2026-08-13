import type { SimulationLogEntry, ValidationIssue } from '../../types/workflow';
import { X, PlayCircle, Loader2, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSimulate: () => void;
  isSimulating: boolean;
  validationIssues: ValidationIssue[];
  logs: SimulationLogEntry[];
}

export function SimulationModal({ isOpen, onClose, onSimulate, isSimulating, validationIssues, logs }: Props) {
  if (!isOpen) return null;

  const hasErrors = validationIssues.some(i => i.type === 'error');

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden border border-gray-200">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <PlayCircle size={22} className="text-blue-600" />
            Workflow Simulation Engine
          </h2>
          <button onClick={onClose} disabled={isSimulating} className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-md shadow-sm border border-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          {validationIssues.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">Validation Results</h3>
              <div className="flex flex-col gap-2">
                {validationIssues.map((issue, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border flex gap-3 text-sm ${
                    issue.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-amber-50 border-amber-100 text-amber-800'
                  }`}>
                    <div className="mt-0.5">
                      {issue.type === 'error' ? <AlertCircle size={16} className="text-red-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
                    </div>
                    <div>
                      <p className="font-semibold">{issue.type === 'error' ? 'Error' : 'Warning'}</p>
                      <p className="opacity-90">{issue.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!hasErrors || logs.length > 0) && (
            <div>
              <div className="flex items-center justify-between mb-3">
                 <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Execution Trace</h3>
                 {isSimulating && (
                    <span className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                      <Loader2 size={12} className="animate-spin" /> Engine Running
                    </span>
                 )}
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs overflow-y-auto min-h-[200px]">
                {logs.length === 0 && !isSimulating && (
                  <p className="text-slate-500 text-center py-10 italic">Ready to engage simulation.</p>
                )}
                
                {logs.map((log, idx) => (
                  <div key={idx} className="mb-2 flex items-start gap-3">
                    <span className="text-slate-500 whitespace-nowrap">[{log.timestamp.toLocaleTimeString()}]</span>
                    
                    <span className={`px-1.5 rounded-sm min-w-[70px] text-center ${
                      log.status === 'started' ? 'bg-blue-900/50 text-blue-400' :
                      log.status === 'success' ? 'bg-emerald-900/50 text-emerald-400' :
                      'bg-red-900/50 text-red-400'
                    }`}>
                      {(log.nodeId).substring(0,6)}
                    </span>
                    
                    <span className="text-slate-300 whitespace-pre-line">
                      {log.status === 'success' && <CheckCircle2 size={14} className="inline text-emerald-400 mr-1 pb-0.5" />}
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={isSimulating}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
          >
            Close
          </button>
          
          <button 
            onClick={onSimulate} 
            disabled={isSimulating || hasErrors}
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
          >
            {isSimulating ? (
              <><Loader2 size={18} className="animate-spin" /> Simulating...</>
            ) : (
               <><PlayCircle size={18} /> Run Execution</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
