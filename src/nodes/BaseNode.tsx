import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Handle, Position } from '@xyflow/react';

interface BaseNodeProps {
  id: string;
  selected: boolean;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  executing?: boolean;
  completed?: boolean;
  error?: string;
  type?: 'start' | 'end' | 'default';
  headerColor?: string;
}

export function BaseNode({ 
  selected, 
  title, 
  icon, 
  children,
  executing,
  completed,
  error,
  type = 'default',
  headerColor = 'bg-blue-600'
}: BaseNodeProps) {
  return (
    <div className={clsx(
      "w-64 bg-white rounded-xl shadow-lg border-2 transition-all duration-300 overflow-hidden",
      selected ? "border-blue-500 shadow-blue-500/30 scale-[1.02]" : "border-gray-200",
      executing && "ring-4 ring-amber-400 shadow-amber-400/50 border-amber-500",
      completed && "border-green-500 shadow-green-500/30",
      error && "border-red-500 ring-4 ring-red-400/50"
    )}>
      {type !== 'start' && (
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400 hover:w-4 hover:h-4 transition-all" />
      )}
      
      <div className={clsx(`flex items-center px-4 py-3`, headerColor)}>
        {icon && <div className="text-white mr-2">{icon}</div>}
        <span className="font-semibold text-white tracking-wide text-sm">{title}</span>
      </div>
      
      <div className="p-4 flex flex-col gap-2 bg-white">
        {children}
        {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
      </div>

      {type !== 'end' && (
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400 hover:w-4 hover:h-4 transition-all" />
      )}
    </div>
  );
}
