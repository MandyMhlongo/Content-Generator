import React from 'react';
import { PromptTemplate } from '../types';

interface PromptSelectorProps {
  templates: PromptTemplate[];
  selectedTemplateId: string | null;
  onSelect: (templateId: string) => void;
}

export const PromptSelector: React.FC<PromptSelectorProps> = ({ templates, selectedTemplateId, onSelect }) => {
  return (
    <div className="mb-6">
      <label htmlFor="prompt-template" className="block text-lg font-medium text-slate-700 mb-2">
        Choose a Creative Template:
      </label>
      <select
        id="prompt-template"
        value={selectedTemplateId || ''}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 transition-colors"
      >
        {templates.map(template => (
          <option key={template.id} value={template.id}>
            {template.category} - {template.name}
          </option>
        ))}
      </select>
      {selectedTemplateId && templates.find(t => t.id === selectedTemplateId) && (
        <p className="mt-2 text-sm text-slate-600">{templates.find(t => t.id === selectedTemplateId)?.description}</p>
      )}
    </div>
  );
};