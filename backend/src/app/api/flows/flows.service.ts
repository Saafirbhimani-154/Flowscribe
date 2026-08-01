import fs from 'fs/promises';
import path from 'path';
import { FLOWS_CONSTANTS } from './flows.constants';

export class FlowsService {
  private provider: string;
  private model: string;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.provider = process.env.LLM_PROVIDER || FLOWS_CONSTANTS.PROVIDERS.OPENROUTER;
    this.model = process.env.LLM_MODEL || FLOWS_CONSTANTS.DEFAULT_MODEL;
    this.apiKey = process.env.LLM_API_KEY || '';

    if (this.provider === FLOWS_CONSTANTS.PROVIDERS.OPENAI) {
      this.baseUrl = FLOWS_CONSTANTS.URLS.OPENAI_BASE;
    } else {
      this.baseUrl = FLOWS_CONSTANTS.URLS.OPENROUTER_BASE;
    }
  }

  public cleanJson(response: string): string {
    const match = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
    if (match && match[1]) {
      return match[1].trim();
    }
    return response.trim();
  }

  public async loadSkill(skillName: string): Promise<string> {
    try {
      const skillPath = path.resolve(__dirname, '../../../../../../.agents/skills', `${skillName}.md`);
      const content = await fs.readFile(skillPath, 'utf8');
      return content;
    } catch (error) {
      console.warn(`[FlowsService] Could not load skill: ${skillName}. Falling back to default prompt.`);
      return `Please act as an AI assistant for task: ${skillName}`;
    }
  }

  public async generateCompletion(systemPrompt: string, userPrompt: string, imagesBase64: string[] = []): Promise<string> {
    if (!this.apiKey) {
      throw new Error('LLM_API_KEY is not defined in the environment.');
    }

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (imagesBase64.length > 0) {
      const content: any[] = [{ type: 'text', text: userPrompt }];
      for (const img of imagesBase64) {
        content.push({
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${img}`
          }
        });
      }
      messages.push({ role: 'user', content });
    } else {
      messages.push({ role: 'user', content: userPrompt });
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:7000',
        'X-Title': 'Flowscribe'
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM Provider API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}

export const flowsService = new FlowsService();
