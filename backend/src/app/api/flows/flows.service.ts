import fs from 'fs/promises';
import path from 'path';

import { AGENTS } from './flowagent.constants';
import type { FlowSessionData, AgentConfig } from './flows.interface';

export class FlowsService {
  constructor() {}

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

  private cleanApiKey(key: string | undefined): string {
    if (!key) return '';
    return key.replace(/['"]/g, '').replace(/^Bearer /i, '').trim();
  }

  /**
   * Universal Agent Runner with automatic Fallback
   */
  private async runAgent(
    config: AgentConfig,
    systemPrompt: string,
    userPrompt: string,
    imagesBase64: string[] = []
  ): Promise<string> {
    if (process.env.DEMO_MODE === 'true') {
      console.log(`[FlowsService] DEMO_MODE ON. Mocking agent: ${config.mainModel}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return this.mockResponse(systemPrompt);
    }

    const mainKey = this.cleanApiKey(process.env[config.mainKeyEnv]);
    const fallbackKey = this.cleanApiKey(process.env[config.fallbackKeyEnv]);

    if (!mainKey && !fallbackKey) {
      throw new Error(`Missing API keys for both Main and Fallback (Env: ${config.mainKeyEnv}, ${config.fallbackKeyEnv})`);
    }

    const messages = this.buildMessages(systemPrompt, userPrompt, imagesBase64);

    // Try Main Model
    if (mainKey) {
      try {
        console.log(`[FlowsService] Attempting MAIN Model (${config.mainModel})...`);
        return await this.fetchLLM(config.mainBaseUrl, config.mainModel, mainKey, messages);
      } catch (error: any) {
        console.warn(`[FlowsService] MAIN Model Failed (${error.message}). Switching to Fallback...`);
      }
    }

    // Try Fallback Model
    if (fallbackKey) {
      try {
        console.log(`[FlowsService] Attempting FALLBACK Model (${config.fallbackModel})...`);
        return await this.fetchLLM(config.fallbackBaseUrl, config.fallbackModel, fallbackKey, messages);
      } catch (error: any) {
        console.error(`[FlowsService] FALLBACK Model also failed:`, error.message);
        throw new Error(`Both Main and Fallback models failed for this role. Last error: ${error.message}`);
      }
    }

    throw new Error('Agent execution failed unexpectedly.');
  }

  private async fetchLLM(url: string, model: string, apiKey: string, messages: any[]): Promise<string> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:7000',
        'X-Title': 'Flowscribe'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  private buildMessages(systemPrompt: string, userPrompt: string, imagesBase64: string[]) {
    const messages: any[] = [{ role: 'system', content: systemPrompt }];
    if (imagesBase64.length > 0) {
      const content: any[] = [{ type: 'text', text: userPrompt }];
      // Nvidia's Llama 3.2 Vision strictly allows a maximum of 1 image per request.
      const limitedImages = imagesBase64.slice(0, 1);
      for (const img of limitedImages) {
        content.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${img}` } });
      }
      messages.push({ role: 'user', content });
    } else {
      messages.push({ role: 'user', content: userPrompt });
    }
    return messages;
  }

  /**
   * The new methods explicitly calling the 4 roles
   */
  public async orchestrate(systemPrompt: string, userPrompt: string, imagesBase64: string[] = []): Promise<string> {
    return this.runAgent(AGENTS.ORCHESTRATOR!, systemPrompt, userPrompt, imagesBase64);
  }

  public async illustrate(systemPrompt: string, userPrompt: string): Promise<string> {
    return this.runAgent(AGENTS.ILLUSTRATOR!, systemPrompt, userPrompt);
  }

  public async audit(systemPrompt: string, userPrompt: string): Promise<string> {
    return this.runAgent(AGENTS.WRITER!, systemPrompt, userPrompt);
  }

  public async formatPaperwork(systemPrompt: string, userPrompt: string): Promise<string> {
    return this.runAgent(AGENTS.PAPERWORKER!, systemPrompt, userPrompt);
  }

  // To remain backwards compatible temporarily or route automatically based on skill name
  public async generateCompletion(role: 'ORCHESTRATOR' | 'ILLUSTRATOR' | 'WRITER' | 'PAPERWORKER', systemPrompt: string, userPrompt: string, imagesBase64: string[] = []): Promise<string> {
    let rawOutput = '';
    
    // Route explicitly based on the requested role
    if (role === 'ORCHESTRATOR') {
      rawOutput = await this.orchestrate(systemPrompt, userPrompt, imagesBase64);
    } 
    else if (role === 'ILLUSTRATOR') {
      rawOutput = await this.illustrate(systemPrompt, userPrompt);
    }
    else if (role === 'WRITER') {
      rawOutput = await this.audit(systemPrompt, userPrompt);
    } 
    else if (role === 'PAPERWORKER') {
      // If we are calling the paperworker directly, just run it and return
      return await this.formatPaperwork(systemPrompt, userPrompt);
    }

    // Pass EVERYTHING through the Paperworker to format the JSON strictly before returning
    const formattingSystemPrompt = "You are a JSON formatting AI. Take the provided raw text and extract/format it strictly into the requested JSON structure based on the user's intent. Return ONLY valid JSON, do not add conversational text or markdown formatting outside of the JSON structure. Remove any ```json formatting.";
    const formattingUserPrompt = `Raw Output:\n${rawOutput}\n\nPlease format this strictly as requested.`;
    
    console.log('[FlowsService] Routing raw output through the PAPERWORKER...');
    return this.formatPaperwork(formattingSystemPrompt, formattingUserPrompt);
  }

  private mockResponse(systemPrompt: string): string {
    if (systemPrompt.includes('vision_extract')) {
      return JSON.stringify({
        nodes: [{ id: '1', label: 'Start Demo', type: 'start' }, { id: '2', label: 'Process', type: 'process' }, { id: '3', label: 'End', type: 'end' }],
        edges: [{ source: '1', target: '2', label: 'init' }, { source: '2', target: '3', label: 'done' }],
        title: 'Mock Flow Builder Demo'
      });
    }
    if (systemPrompt.includes('ambiguity')) return JSON.stringify(["What happens if the data is invalid?"]);
    if (systemPrompt.includes('gap_audit')) return JSON.stringify({ gaps: [{ issue: "Missing error handling", recommendation: "Add error node" }], edgeCases: [{ scenario: "User goes offline", resolution: "Retry logic" }] });
    if (systemPrompt.includes('diagrams')) return JSON.stringify({ diagrams: { activity: `flowchart TD\nA-->B`, stateMachine: `stateDiagram-v2\n[*]-->A` }, schema: { tables: [] } });
    return JSON.stringify({ message: 'demo ok' });
  }
}

export const flowsService = new FlowsService();
