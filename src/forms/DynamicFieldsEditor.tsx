import type { CustomField } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  fields?: CustomField[];
  onChange: (fields: CustomField[]) => void;
}

export function DynamicFieldsEditor({ fields = [], onChange }: Props) {
  const addField = () => {
    onChange([...fields, { id: uuidv4(), key: '', value: '' }]);
  };

  const updateField = (id: string, key: string, value: string) => {
    onChange(fields.map(f => f.id === id ? { ...f, key, value } : f));
  };

  const removeField = (id: string) => {
    onChange(fields.filter(f => f.id !== id));
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">Custom Fields</label>
        <button onClick={addField} className="text-xs flex items-center text-blue-600 hover:text-blue-800">
          <Plus size={14} className="mr-1" /> Add Field
        </button>
      </div>
      
      <div className="flex flex-col gap-2">
        {fields.length === 0 && (
          <p className="text-xs text-gray-400 italic">No custom fields added.</p>
        )}
        {fields.map(field => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Key"
              value={field.key}
              onChange={(e) => updateField(field.id, e.target.value, field.value)}
              className="w-1/2 p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Value"
              value={field.value}
              onChange={(e) => updateField(field.id, field.key, e.target.value)}
              className="w-1/2 p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <button onClick={() => removeField(field.id)} className="text-red-500 hover:text-red-700 p-1">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
