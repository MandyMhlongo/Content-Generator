import React from 'react';
import { PromptParameter } from '../types';

interface ParameterInputFieldsProps {
  parameters: PromptParameter[];
  values: Record<string, string | number>;
  errors: Record<string, string>;
  onChange: (id: string, value: string | number) => void;
}

export const ParameterInputFields: React.FC<ParameterInputFieldsProps> = ({ parameters, values, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {parameters.map(param => (
        <div key={param.id}>
          <label htmlFor={param.id} className="block text-sm font-medium text-slate-700 mb-1">
            {param.label} {param.validation?.required && <span className="text-red-600">*</span>}
          </label>
          {param.type === 'textarea' ? (
            <textarea
              id={param.id}
              rows={3}
              value={values[param.id] as string || ''}
              onChange={(e) => onChange(param.id, e.target.value)}
              placeholder={param.placeholder}
              className={`w-full p-2 bg-white border ${errors[param.id] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 transition-colors`}
            />
          ) : (
            <input
              type={param.type}
              id={param.id}
              value={values[param.id] || (param.type === 'number' ? '' : '')}
              onChange={(e) => onChange(param.id, param.type === 'number' ? parseFloat(e.target.value) || e.target.value : e.target.value)}
              placeholder={param.placeholder}
              min={param.type === 'number' && param.validation?.min !== undefined ? param.validation.min : undefined}
              max={param.type === 'number' && param.validation?.max !== undefined ? param.validation.max : undefined}
              className={`w-full p-2 bg-white border ${errors[param.id] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 transition-colors`}
            />
          )}
          {errors[param.id] && <p className="mt-1 text-xs text-red-600">{errors[param.id]}</p>}
        </div>
      ))}
    </div>
  );
};