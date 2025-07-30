
import { PromptCategory, PromptTemplate } from './types';

export const API_MODEL_NAME = 'gemini-2.5-flash';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // Story Templates (5 total)
  {
    id: 'story-general',
    name: 'General Short Story',
    category: PromptCategory.STORY,
    description: 'Craft a short story based on genre, characters, and plot points.',
    systemInstruction: 'You are a creative storyteller. Your goal is to write engaging and imaginative short stories.',
    parameters: [
      { id: 'genre', label: 'Genre', type: 'text', defaultValue: 'Fantasy', validation: { required: true } },
      { id: 'protagonist', label: 'Protagonist (e.g., A weary detective, a curious alien)', type: 'textarea', placeholder: 'Describe the main character', validation: { required: true, minLength: 10 } },
      { id: 'setting', label: 'Setting (e.g., A futuristic city, a haunted mansion)', type: 'text', placeholder: 'Where does the story take place?' },
      { id: 'plot_hook', label: 'Plot Hook (e.g., A mysterious message, a sudden disappearance)', type: 'textarea', placeholder: 'What kicks off the story?', validation: { required: true } },
      { id: 'tone', label: 'Tone (e.g., suspenseful, humorous, melancholic)', type: 'text', defaultValue: 'engaging' },
      { id: 'length_words', label: 'Approx. Word Count', type: 'number', defaultValue: '300', validation: { min: 50, max: 1500 } }
    ],
    constructPrompt: (params) => `
      Write a short story with an approximate word count of ${params.length_words || '300'} words.
      Genre: ${params.genre}.
      Tone: ${params.tone}.
      Protagonist: ${params.protagonist}.
      Setting: ${params.setting || 'a vividly imagined location'}.
      Plot Hook: ${params.plot_hook}.
      Make the story compelling and well-structured.
    `
  },
  {
    id: 'story-flash-fiction',
    name: 'Flash Fiction Challenge',
    category: PromptCategory.STORY,
    description: 'Write a very short story (e.g., 100-200 words) based on a single concept.',
    systemInstruction: 'You are a master of concise storytelling. Craft a complete and impactful flash fiction piece.',
    parameters: [
      { id: 'concept', label: 'Core Concept/Image', type: 'text', placeholder: 'e.g., A clock that ticks backwards, a city made of glass', validation: { required: true } },
      { id: 'word_limit', label: 'Word Limit', type: 'number', defaultValue: '150', validation: { min: 50, max: 300 } },
      { id: 'desired_emotion', label: 'Desired Emotion (optional)', type: 'text', placeholder: 'e.g., Mysterious, hopeful, unsettling' }
    ],
    constructPrompt: (params) => `
      Compose a piece of flash fiction, approximately ${params.word_limit} words, based on the concept: "${params.concept}".
      ${params.desired_emotion ? `The story should evoke a sense of ${params.desired_emotion}.` : ''}
      Focus on impact and brevity.
    `
  },
  {
    id: 'story-dialogue-scene',
    name: 'Dialogue Scene',
    category: PromptCategory.STORY,
    description: 'Create a short scene driven primarily by dialogue between two characters.',
    systemInstruction: 'You are a playwright. Write a compelling dialogue scene that reveals character and advances a situation.',
    parameters: [
      { id: 'character_a_desc', label: 'Character A Description', type: 'text', placeholder: 'e.g., A nervous young inventor', validation: { required: true } },
      { id: 'character_b_desc', label: 'Character B Description', type: 'text', placeholder: 'e.g., A skeptical investor', validation: { required: true } },
      { id: 'scenario', label: 'Scenario/Conflict', type: 'textarea', placeholder: 'e.g., Character A is pitching a wild idea to Character B', validation: { required: true } },
      { id: 'setting_brief', label: 'Brief Setting (optional)', type: 'text', placeholder: 'e.g., A cluttered workshop, a sterile office' }
    ],
    constructPrompt: (params) => `
      Write a dialogue-driven scene between two characters:
      Character A: ${params.character_a_desc}
      Character B: ${params.character_b_desc}
      Scenario: ${params.scenario}
      ${params.setting_brief ? `Setting: ${params.setting_brief}` : ''}
      Focus on realistic and engaging dialogue that reveals their personalities and the tension of the situation.
    `
  },
  {
    id: 'story-twist-ending',
    name: 'Twist Ending Story',
    category: PromptCategory.STORY,
    description: 'Craft a short story with an unexpected twist at the end.',
    systemInstruction: 'You are a master of suspense and surprise endings. Write a story that cleverly subverts expectations.',
    parameters: [
      { id: 'genre', label: 'Genre', type: 'text', defaultValue: 'Mystery', validation: { required: true } },
      { id: 'initial_setup', label: 'Initial Setup/Premise', type: 'textarea', placeholder: 'Briefly describe the beginning of the story', validation: { required: true } },
      { id: 'protagonist_goal', label: 'Protagonist\'s Initial Goal', type: 'text', placeholder: 'e.g., To solve a crime, to find a hidden object', validation: { required: true } },
      { id: 'length_words', label: 'Approx. Word Count', type: 'number', defaultValue: '400', validation: { min: 100, max: 1000 } }
    ],
    constructPrompt: (params) => `
      Write a short ${params.genre} story, approximately ${params.length_words} words, with a significant twist ending.
      Initial Premise: ${params.initial_setup}.
      The protagonist is trying to achieve: ${params.protagonist_goal}.
      Build suspense or misdirection, leading to an unexpected reveal.
    `
  },
  {
    id: 'story-historical-snippet',
    name: 'Historical Fiction Snippet',
    category: PromptCategory.STORY,
    description: 'Write a brief scene set in a specific historical period, focusing on a character\'s experience.',
    systemInstruction: 'You are a historical fiction author. Transport the reader to another time with vivid details and authentic character voices.',
    parameters: [
      { id: 'historical_period', label: 'Historical Period & Location', type: 'text', placeholder: 'e.g., Ancient Rome, 1920s Paris', validation: { required: true } },
      { id: 'character_role', label: 'Character Role/Perspective', type: 'text', placeholder: 'e.g., A legionary, a flapper, a peasant', validation: { required: true } },
      { id: 'key_event_or_detail', label: 'Focus Event or Detail', type: 'textarea', placeholder: 'e.g., A local festival, the arrival of news, a daily chore', validation: { required: true } },
      { id: 'desired_mood', label: 'Desired Mood', type: 'text', defaultValue: 'atmospheric', validation: { required: true } }
    ],
    constructPrompt: (params) => `
      Create a short historical fiction snippet (around 200-300 words).
      Setting: ${params.historical_period}.
      Perspective: A ${params.character_role}.
      Focus: ${params.key_event_or_detail}.
      Mood: ${params.desired_mood}.
      Immerse the reader in the period through sensory details and the character's internal experience.
    `
  },

  // Poem Templates (5 total)
  {
    id: 'haiku-poem',
    name: 'Haiku Poem',
    category: PromptCategory.POEM,
    description: 'Generate a haiku (5-7-5 syllables) on a given topic.',
    systemInstruction: 'You are a poet specializing in Japanese forms. You craft beautiful and evocative haikus.',
    parameters: [
      { id: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g., Autumn, Silence, Ocean', validation: { required: true } }
    ],
    constructPrompt: (params) => `
      Compose a haiku (three lines with 5, 7, and 5 syllables respectively) about the following topic: ${params.topic}.
      Ensure the haiku captures the essence of the topic concisely and evocatively.
    `
  },
  {
    id: 'limerick-poem',
    name: 'Limerick Poem',
    category: PromptCategory.POEM,
    description: 'Create a humorous limerick with an AABBA rhyming scheme.',
    systemInstruction: 'You are a witty limerick writer. Your limericks are known for their humor and clever rhymes.',
    parameters: [
      { id: 'subject_name', label: 'Subject\'s Name (optional)', type: 'text', placeholder: 'e.g., Stan, a cat from Japan' },
      { id: 'subject_description', label: 'Subject Description', type: 'textarea', placeholder: 'e.g., A curious young man from Peru, A baker with skills quite askew', validation: { required: true } },
      { id: 'action_or_quirk', label: 'Action or Quirk', type: 'textarea', placeholder: 'e.g., Who loved to dance in the dew, Whose cakes often turned blue', validation: { required: true } }
    ],
    constructPrompt: (params) => `
      Compose a limerick. A limerick is a five-line poem with a specific rhyming scheme (AABBA) and syllable structure, often humorous.
      The subject is: ${params.subject_name ? params.subject_name + ', ' : ''}${params.subject_description}.
      Their notable action or quirk is: ${params.action_or_quirk}.
      Ensure the limerick is funny and follows the AABBA rhyme scheme.
    `
  },
  {
    id: 'poem-thematic',
    name: 'Thematic Poem',
    category: PromptCategory.POEM,
    description: 'Generate a poem based on a theme, style, and desired length.',
    systemInstruction: 'You are an accomplished poet. You craft verses that resonate with emotion and imagery.',
    parameters: [
      { id: 'theme', label: 'Theme', type: 'text', placeholder: 'e.g., Hope, Loss, Nature\'s beauty', validation: { required: true } },
      { id: 'style', label: 'Poetic Style (e.g., Free verse, rhyming couplets, narrative)', type: 'text', defaultValue: 'free verse', validation: { required: true } },
      { id: 'mood', label: 'Mood (e.g., Reflective, joyful, somber)', type: 'text', defaultValue: 'reflective', validation: { required: true } },
      { id: 'length_lines', label: 'Approx. Number of Lines (optional)', type: 'number', placeholder: 'e.g., 12-16 lines' }
    ],
    constructPrompt: (params) => `
      Compose a poem about the theme of "${params.theme}".
      The desired style is ${params.style}.
      The mood should be ${params.mood}.
      ${params.length_lines ? `The poem should be approximately ${params.length_lines} lines long.` : 'The length should be appropriate for the theme and style.'}
      Craft a poem that is both expressive and well-structured.
    `
  },
  {
    id: 'poem-sonnet',
    name: 'Sonnet Generator',
    category: PromptCategory.POEM,
    description: 'Compose a sonnet (14 lines, specific rhyme scheme) on a given theme.',
    systemInstruction: 'You are a classical poet. Construct a well-formed sonnet adhering to traditional structures.',
    parameters: [
      { id: 'theme', label: 'Theme of the Sonnet', type: 'text', placeholder: 'e.g., Love, Beauty, Time, Nature', validation: { required: true } },
      { id: 'rhyme_scheme', label: 'Rhyme Scheme Preference', type: 'text', defaultValue: 'Shakespearean (ABAB CDCD EFEF GG)', placeholder: 'e.g., Shakespearean, Petrarchan' }
    ],
    constructPrompt: (params) => `
      Compose a sonnet (14 lines) on the theme of "${params.theme}".
      Adhere to the ${params.rhyme_scheme || 'Shakespearean'} rhyme scheme and iambic pentameter if possible.
      The sonnet should explore the theme thoughtfully and poetically.
    `
  },
  {
    id: 'poem-ode',
    name: 'Ode to an Object/Concept',
    category: PromptCategory.POEM,
    description: 'Write an ode celebrating or thoughtfully examining an everyday object or abstract concept.',
    systemInstruction: 'You are a lyrical poet. Write an expressive ode that elevates its subject.',
    parameters: [
      { id: 'subject_of_ode', label: 'Subject of the Ode', type: 'text', placeholder: 'e.g., A coffee mug, Silence, The Moon', validation: { required: true } },
      { id: 'key_qualities_to_explore', label: 'Key Qualities/Aspects', type: 'textarea', placeholder: 'e.g., Its warmth, its history, its mystery', validation: { required: true } },
      { id: 'desired_tone', label: 'Desired Tone', type: 'text', defaultValue: 'reverent', placeholder: 'e.g., Reverent, humorous, melancholic' }
    ],
    constructPrompt: (params) => `
      Write an ode dedicated to "${params.subject_of_ode}".
      The poem should explore these qualities/aspects: ${params.key_qualities_to_explore}.
      The tone should be ${params.desired_tone}.
      Craft a lyrical and expressive poem that dignifies or deeply considers the subject.
    `
  },

  // Existing Character and Worldbuilding templates (will not be shown in the new tabs but kept for completeness)
  {
    id: 'character-bio',
    name: 'Character Bio Sketch',
    category: PromptCategory.CHARACTER,
    description: 'Develop a brief biography for a fictional character.',
    systemInstruction: 'You are a character designer. You create rich and believable character sketches.',
    parameters: [
      { id: 'name', label: 'Character Name', type: 'text', placeholder: 'e.g., Elara Vance, RX-8', validation: { required: true } },
      { id: 'archetype', label: 'Archetype/Role (e.g., The Mentor, The Rebel, The Explorer)', type: 'text', defaultValue: 'The Hero', validation: { required: true } },
      { id: 'key_trait', label: 'Key Trait (e.g., Unwavering loyalty, crippling fear of heights)', type: 'text', validation: { required: true } },
      { id: 'motivation', label: 'Primary Motivation (e.g., To find a lost artifact, to protect their family)', type: 'textarea', placeholder: 'What drives this character?', validation: { required: true } },
      { id: 'quirk', label: 'A Quirk or Habit (optional)', type: 'text', placeholder: 'e.g., Always humming, collects strange buttons' }
    ],
    constructPrompt: (params) => `
      Create a character biography sketch for:
      Name: ${params.name}.
      Archetype/Role: ${params.archetype}.
      Key Trait: ${params.key_trait}.
      Primary Motivation: ${params.motivation}.
      ${params.quirk ? `Quirk/Habit: ${params.quirk}.` : ''}
      Provide a compelling and concise description of this character, highlighting their personality and driving forces.
    `
  },
  {
    id: 'world-snippet',
    name: 'Worldbuilding Snippet',
    category: PromptCategory.WORLDBUILDING,
    description: 'Describe a small, evocative scene or aspect of a fictional world.',
    systemInstruction: 'You are a worldbuilder. You paint vivid pictures of fictional places with your words.',
    parameters: [
      { id: 'world_name', label: 'Name of the World', type: 'text', placeholder: 'e.g., Aethelgard, Xylos Sector', validation: { required: true } },
      { id: 'key_feature', label: 'Key Feature/Element to Focus On', type: 'text', placeholder: 'e.g., Floating islands, a bioluminescent forest, ancient ruins', validation: { required: true } },
      { id: 'atmosphere', label: 'Atmosphere/Mood', type: 'text', placeholder: 'e.g., Mystical, desolate, bustling, eerie', validation: { required: true } },
      { id: 'sensory_details', label: 'Sensory Details to Include (optional)', type: 'textarea', placeholder: 'e.g., Smell of strange spices, sound of distant chimes' }
    ],
    constructPrompt: (params) => `
      Describe an evocative snippet or scene from the world of ${params.world_name}.
      Focus on its distinctive feature: ${params.key_feature}.
      The atmosphere should be: ${params.atmosphere}.
      ${params.sensory_details ? `Incorporate these sensory details if possible: ${params.sensory_details}.` : 'Use vivid sensory details to bring the scene to life.'}
      Paint a brief but memorable picture of this aspect of the world.
    `
  }
];

export const PROMPT_ENGINEERING_INFO = `
## Prompt Engineering Methodology

Our approach to crafting effective prompts for generative AI focuses on several key principles:

1.  **Clarity and Specificity:**
    *   **Goal:** Ensure the AI understands exactly what is being asked.
    *   **Method:** Use precise language. Avoid ambiguity. Clearly define the desired output format, style, length, and content.
    *   *Example:* Instead of "Write a story," use "Write a 500-word science fiction story about a lone astronaut discovering an alien artifact on Mars, with a suspenseful tone."

2.  **Role-Playing / Persona Assignment (System Instructions):**
    *   **Goal:** Guide the AI's tone, style, and knowledge domain.
    *   **Method:** Instruct the AI to adopt a specific persona using a system instruction.
    *   *Example:* "You are a seasoned travel writer specializing in budget adventures. Describe three offbeat destinations in Southeast Asia." (Our templates use this strategy.)

3.  **Providing Context:**
    *   **Goal:** Give the AI necessary background information to generate relevant and accurate content.
    *   **Method:** Include key details, background information, or constraints directly in the prompt.
    *   *Example:* For a character bio, providing existing lore or world details helps the AI create a consistent character.

4.  **Constraints and Formatting Instructions:**
    *   **Goal:** Control the structure and presentation of the output.
    *   **Method:** Specify desired length (word count, lines), format (haiku, limerick, list, paragraph), and any structural requirements (e.g., rhyming scheme).
    *   *Example:* "List 5 potential titles for a fantasy novel. Each title should be no more than 5 words."

5.  **Iterative Refinement:**
    *   **Goal:** Continuously improve prompt effectiveness.
    *   **Method:** Start with a basic prompt and analyze the output. Modify the prompt based on the results, adding more detail, clarifying instructions, or trying different phrasings until the desired output is achieved. This is a crucial step in discovering what works best with a particular model.

6.  **Use of Keywords:**
    *   **Goal:** Steer the AI towards specific topics, themes, or styles.
    *   **Method:** Strategically embed relevant keywords that align with the desired output.
    *   *Example:* Including "noir," "cyberpunk," or "romantic comedy" to influence genre.

7.  **Output Filtering and Validation (Application Layer):**
    *   **Goal:** Ensure the final output meets quality and safety standards.
    *   **Method:** While the AI model has its own safety filters, the application can add checks for relevance, completeness, or adherence to specific non-AI constraints. This tool performs basic input validation to guide the user towards better prompts.

By applying these techniques, we aim to maximize the quality, relevance, and creativity of the content generated by the AI.
`;
