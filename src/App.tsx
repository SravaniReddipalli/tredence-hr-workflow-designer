import { useState } from 'react';
import { useWorkflowState } from './hooks/useWorkflowState';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Canvas } from './components/WorkflowCanvas/Canvas';
import { ConfigPanel } from './components/NodeConfigPanel/ConfigPanel';
import { SimulationModal } from './components/SimulationPanel/SimulationModal';
import { ShieldCheck } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import './index.css';

function App() {
  const {
    nodes, edges, setNodes,
    onNodesChange, onEdgesChange, onNodesDelete, onConnect,
    selectedNodeId, setSelectedNodeId,
    updateNodeData,
    validationIssues, validate,
    simulationLogs, isSimulating, runSimulation
  } = useWorkflowState();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  const handleValidateAndOpen = () => {
    validate();
    setIsModalOpen(true);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50 font-sans">
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <span className="font-bold tracking-wider text-sm w-5 h-5 flex items-center justify-center leading-none">TR</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">HR Workflow Designer</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleValidateAndOpen}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm"
          >
            <ShieldCheck size={16} /> Validate & Test
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <Canvas 
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onConnect={onConnect}
          setNodes={setNodes}
          setSelectedNodeId={setSelectedNodeId}
        />
        
        <ConfigPanel 
          selectedNode={selectedNode}
          updateNodeData={updateNodeData}
        />
      </div>

      <SimulationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSimulate={runSimulation}
        isSimulating={isSimulating}
        validationIssues={validationIssues}
        logs={simulationLogs}
      />
    </div>
  )
}

export default App
