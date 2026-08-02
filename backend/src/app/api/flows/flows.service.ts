import fs from 'fs/promises';
import path from 'path';
import { FLOWS_CONSTANTS } from './flows.constants';

export class FlowsService {
  private provider: string;
  private model: string;
  private apiKeys: string[];
  private baseUrl: string;

  constructor() {
    this.provider = process.env.LLM_PROVIDER || FLOWS_CONSTANTS.PROVIDERS.OPENROUTER;
    this.model = process.env.LLM_MODEL || FLOWS_CONSTANTS.DEFAULT_MODEL;
    
    // Parse comma-separated keys from LLM_API_KEYS, fallback to LLM_API_KEY
    const keysRaw = process.env.LLM_API_KEYS || process.env.LLM_API_KEY || '';
    this.apiKeys = keysRaw.split(',').map(k => k.trim()).filter(k => k.length > 0);

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
      const skillPath = path.resolve(__dirname, '../../../skills', `${skillName}.md`);
      const content = await fs.readFile(skillPath, 'utf8');
      return content;
    } catch (error) {
      console.warn(`[FlowsService] Could not load skill: ${skillName} at path. Falling back to default prompt.`);
      return `Please act as an AI assistant for task: ${skillName}`;
    }
  }

  public async generateCompletion(systemPrompt: string, userPrompt: string, imagesBase64: string[] = []): Promise<string> {
    if (process.env.DEMO_MODE === 'true') {
      console.log('[FlowsService] DEMO_MODE is ON. Returning mock data after 2 seconds.');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Determine what to mock based on the prompt type
      if (systemPrompt.includes('vision_extract')) {
        return JSON.stringify({
          nodes: [
            { id: '1', label: 'Start Demo', type: 'start' },
            { id: '2', label: 'Process Data', type: 'process' },
            { id: '3', label: 'End Demo', type: 'end' }
          ],
          edges: [
            { source: '1', target: '2', label: 'init' },
            { source: '2', target: '3', label: 'done' }
          ],
          title: 'Mock Flow Builder Demo'
        });
      }
      
      if (systemPrompt.includes('ambiguity')) {
        return JSON.stringify(["What happens if the data is invalid? (Mock Question)"]);
      }
      
      if (systemPrompt.includes('gap_audit')) {
        return JSON.stringify({
          gaps: [{ issue: "Missing error handling", recommendation: "Add error node" }],
          edgeCases: [{ scenario: "User goes offline", resolution: "Retry logic" }]
        });
      }
      
      if (systemPrompt.includes('diagrams')) {
        return JSON.stringify({
          diagrams: {
            activity: `flowchart TD\n  A[Start Demo] --> B[Process Data]\n  B --> C[End Demo]`,
            stateMachine: `stateDiagram-v2\n  [*] --> StartDemo\n  StartDemo --> ProcessData\n  ProcessData --> EndDemo\n  EndDemo --> [*]`
          },
          schema: {
            tables: [{
              name: 'DemoData',
              fields: [{ name: 'id', type: 'String' }, { name: 'status', type: 'String' }]
            }]
          }
        });
      }
    }

    if (this.apiKeys.length === 0) {
      throw new Error('No LLM_API_KEYS defined in the environment.');
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

    let lastError: Error | null = null;

    // Loop through all available API keys
    for (let i = 0; i < this.apiKeys.length; i++) {
      const apiKey = this.apiKeys[i];
      try {
        console.log(`[FlowsService] Attempting LLM request with Key #${i + 1}...`);
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
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
          throw new Error(`LLM Provider API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
      } catch (error: any) {
        console.error(`[FlowsService] Request failed with Key #${i + 1}:`, error.message);
        lastError = error;
        // If there are more keys, it will naturally continue to the next loop iteration
      }
    }

    throw new Error(`All available LLM API keys failed. Last error: ${lastError?.message}`);
  }
}

export const flowsService = new FlowsService();
