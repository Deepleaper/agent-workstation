export interface TemplateInfo {
  id: string;
  category: string;
  title: string;
  titleZh: string;
  description: string;
  emoji: string;
  industry: string;
  skills: string[];
  metrics: string[];
  hasBrainSeed: boolean;
  brainSeedFiles: string[];
  downloads: number;
}

export interface TemplateDetail extends TemplateInfo {
  oad: Record<string, any>;
  brainSeed: { file: string; content: string }[];
  systemPrompt?: string;
}

export interface TemplateIndex {
  generatedAt: string;
  total: number;
  templates: TemplateInfo[];
}
