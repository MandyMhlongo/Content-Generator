
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PromptTemplate, GeminiResponseData, PromptCategory } from './types';
import { PROMPT_TEMPLATES, PROMPT_ENGINEERING_INFO } from './constants';
import { Header } from './components/Header';
import { PromptSelector } from './components/PromptSelector';
import { ParameterInputFields } from './components/ParameterInputFields';
import { GeneratedContentDisplay } from './components/GeneratedContentDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { InfoModal } from './components/InfoModal';
import { generateContentWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PromptCategory>(PromptCategory.STORY);
  
  const templatesForActiveTab = useMemo(() => {
    return PROMPT_TEMPLATES.filter(t => t.category === activeTab).slice(0, 5);
  }, [activeTab]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(templatesForActiveTab[0]?.id || null);
  const [parameters, setParameters] = useState<Record<string, string | number>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<GeminiResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  const selectedTemplate = useMemo(() => 
    PROMPT_TEMPLATES.find(t => t.id === selectedTemplateId)
  , [selectedTemplateId]);

  // Effect to handle tab changes: update selected template and reset states
  useEffect(() => {
    const firstTemplateInTab = templatesForActiveTab[0];
    if (firstTemplateInTab) {
      setSelectedTemplateId(firstTemplateInTab.id);
    } else {
      setSelectedTemplateId(null);
    }
    // Parameters will be reset by the effect below once selectedTemplateId changes
    setGeneratedContent(null);
    setFormErrors({});
    setError(null);
  }, [activeTab, templatesForActiveTab]);

  // Effect to initialize parameters when selectedTemplateId changes
  useEffect(() => {
    if (selectedTemplate) {
      const initialParams: Record<string, string | number> = {};
      selectedTemplate.parameters.forEach(p => {
        if (p.defaultValue !== undefined) {
          initialParams[p.id] = p.type === 'number' ? parseFloat(p.defaultValue) : p.defaultValue;
        } else {
          initialParams[p.id] = p.type === 'number' ? 0 : ''; // Or handle empty number fields appropriately
        }
      });
      setParameters(initialParams);
      // Reset these here as well, for when template changes within the same tab
      setGeneratedContent(null); 
      setFormErrors({});
      setError(null);
    } else {
      setParameters({}); // Clear parameters if no template is selected
    }
  }, [selectedTemplateId, selectedTemplate]); // selectedTemplate is a dependency because its structure defines parameters

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const handleParameterChange = useCallback((id: string, value: string | number) => {
    setParameters(prevParams => ({ ...prevParams, [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[id];
        return newErrors;
      });
    }
  }, [formErrors]);

  const validateInputs = (): boolean => {
    if (!selectedTemplate) return false;
    const errors: Record<string, string> = {};
    selectedTemplate.parameters.forEach(param => {
      const value = parameters[param.id];
      if (param.validation?.required && (value === undefined || value === '' || (param.type === 'number' && isNaN(Number(value))))) {
        errors[param.id] = `${param.label} is required.`;
      }
      if (param.type === 'text' || param.type === 'textarea') {
        const strValue = String(value);
        if (param.validation?.minLength && strValue.length < param.validation.minLength) {
          errors[param.id] = `${param.label} must be at least ${param.validation.minLength} characters.`;
        }
        if (param.validation?.maxLength && strValue.length > param.validation.maxLength) {
          errors[param.id] = `${param.label} must be no more than ${param.validation.maxLength} characters.`;
        }
      }
      if (param.type === 'number' && !isNaN(Number(value))) { // only validate if it's a number
        const numValue = Number(value);
        if (param.validation?.min !== undefined && numValue < param.validation.min) {
          errors[param.id] = `${param.label} must be at least ${param.validation.min}.`;
        }
        if (param.validation?.max !== undefined && numValue > param.validation.max) {
          errors[param.id] = `${param.label} must be no more than ${param.validation.max}.`;
        }
      }
      if (param.validation?.pattern && !new RegExp(param.validation.pattern).test(String(value))) {
        errors[param.id] = `${param.label} is not in the correct format.`;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!selectedTemplate || !validateInputs()) {
      setError("Please fill in all required fields correctly.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const prompt = selectedTemplate.constructPrompt(parameters);
      const systemInstruction = selectedTemplate.systemInstruction;
      const result = await generateContentWithGemini(prompt, systemInstruction);
      
      if (!result || !result.text.trim()) {
        setError("The generated content was empty. Try adjusting your inputs or try again.");
        setGeneratedContent(null);
      } else {
        setGeneratedContent(result);
      }
    } catch (err) {
      console.error("Error generating content:", err);
      if (err instanceof Error) {
        setError(`Failed to generate content: ${err.message}. Check if your API key is configured.`);
      } else {
        setError("An unknown error occurred while generating content.");
      }
      setGeneratedContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const TabButton: React.FC<{ category: PromptCategory; label: string }> = ({ category, label }) => (
    <button
      className={`px-4 py-3 font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:z-10 transition-colors duration-150 ease-in-out
        ${activeTab === category 
          ? 'bg-emerald-600 text-white shadow-md' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }
        ${category === PromptCategory.STORY ? 'rounded-l-lg' : ''}
        ${category === PromptCategory.POEM ? 'rounded-r-lg' : ''}
      `}
      onClick={() => setActiveTab(category)}
      aria-pressed={activeTab === category}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 space-y-6 text-slate-800">
      <Header onInfoClick={() => setIsInfoModalOpen(true)} />

      <main className="w-full max-w-4xl bg-white shadow-2xl rounded-lg p-6 md:p-8 space-y-6">
        
        <div className="mb-6">
          <label className="block text-lg font-medium text-slate-700 mb-2">
            Select a Content Category:
          </label>
          <div className="flex">
            <TabButton category={PromptCategory.STORY} label="Stories" />
            <TabButton category={PromptCategory.POEM} label="Poems" />
          </div>
        </div>

        <PromptSelector
          templates={templatesForActiveTab}
          selectedTemplateId={selectedTemplateId}
          onSelect={handleTemplateSelect}
        />

        {selectedTemplate && (
          <ParameterInputFields
            parameters={selectedTemplate.parameters}
            values={parameters}
            errors={formErrors}
            onChange={handleParameterChange}
          />
        )}

        <div className="flex justify-center pt-2">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !selectedTemplate}
            className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
            aria-live="polite"
          >
            {isLoading ? <LoadingSpinner small={true} /> : 'Generate Content'}
          </button>
        </div>

        {error && <ErrorMessage message={error} />}
        
        {isLoading && !error && (
          <div className="mt-6 flex flex-col items-center justify-center text-slate-600">
            <LoadingSpinner />
            <p className="mt-2">Generating creative masterpiece...</p>
          </div>
        )}

        {!isLoading && generatedContent && (
          <GeneratedContentDisplay content={generatedContent.text} groundingMetadata={generatedContent.candidates?.[0]?.groundingMetadata} />
        )}
      </main>
      
      <footer className="text-center text-sm text-gray-500 py-4 bg-white/70 backdrop-blur-sm rounded-md px-4">
        Powered by Gemini API. Mandy Creative Content Generator © 2024
      </footer>

      {isInfoModalOpen && (
        <InfoModal onClose={() => setIsInfoModalOpen(false)} title="Prompt Engineering Methodology">
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: PROMPT_ENGINEERING_INFO.replace(/\n/g, '<br />').replace(/## (.*?)<br \/>/g, '<h2>$1</h2>').replace(/### (.*?)<br \/>/g, '<h3>$1</h3>').replace(/\*\*Goal:\*\*/g, '<strong>Goal:</strong>').replace(/\*\*Method:\*\*/g, '<strong>Method:</strong>').replace(/\*Example:\*/g, '<em>Example:</em>') }} />
        </InfoModal>
      )}
    </div>
  );
};

export default App;
