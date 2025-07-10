
export enum PromptCategory {
  STORY = "Story",
  POEM = "Poem",
  CHARACTER = "Character",
  WORLDBUILDING = "Worldbuilding"
}

export interface PromptParameterValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string; // regex pattern
}

export interface PromptParameter {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea';
  defaultValue?: string;
  placeholder?: string;
  validation?: PromptParameterValidation;
  options?: string[]; // For select, if ever needed
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: PromptCategory;
  description: string;
  parameters: PromptParameter[];
  constructPrompt: (params: Record<string, string | number>) => string;
  systemInstruction?: string;
}

export interface GroundingChunkWeb {
  uri?: string; // Made optional to match Gemini API
  title?: string; // Made optional to match Gemini API and for robustness
}
export interface GroundingChunk {
  web?: GroundingChunkWeb;
}
export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}
export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  // Note: The actual Candidate type from @google/genai has more properties.
  // We only define what we use to ensure compatibility.
}

// Simplified from GenerateContentResponse as we mostly care about text and grounding
export interface GeminiResponseData {
  text: string;
  candidates?: Candidate[];
}
