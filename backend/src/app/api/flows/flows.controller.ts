import { Request, Response, NextFunction } from 'express';
import { flowsService } from './flows.service';
import { FlowSessionData } from './flows.interface';
import { FLOWS_MESSAGES } from './flows.constants';

export const analyzeFlow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    const { context } = req.body;

    if ((!files || files.length === 0) && (!context || context.trim() === '')) {
      return res.status(400).json({ success: false, message: FLOWS_MESSAGES.ERROR.NO_INPUT });
    }

    const imagesBase64 = files ? files.map(file => file.buffer.toString('base64')) : [];
    
    const visionSystemPrompt = await flowsService.loadSkill('vision_extract');
    let userPrompt = "Please extract the logical process flow from these images and return ONLY valid JSON matching the specified schema.";
    
    if (context && context.trim() !== '') {
      userPrompt = `User's Additional Context: "${context.trim()}"\n\n${userPrompt}`;
    }
    
    console.log('[analyzeFlow] Calling LLM Vision...');
    const visionOutput = await flowsService.generateCompletion('ORCHESTRATOR', visionSystemPrompt, userPrompt, imagesBase64);
    const cleanedVisionOutput = flowsService.cleanJson(visionOutput);
    
    let sessionData: FlowSessionData;
    try {
      sessionData = JSON.parse(cleanedVisionOutput);
    } catch (error) {
      console.error('[analyzeFlow] Failed to parse vision JSON:', cleanedVisionOutput);
      return res.status(500).json({ success: false, message: FLOWS_MESSAGES.ERROR.INVALID_JSON_VISION });
    }

    const ambiguitySystemPrompt = await flowsService.loadSkill('ambiguity');
    const ambiguityUserPrompt = `Here is the extracted flow data:\n${JSON.stringify(sessionData, null, 2)}\n\nPlease generate clarifying questions for any ambiguities. Return ONLY a valid JSON array of strings.`;
    
    console.log('[analyzeFlow] Calling LLM Ambiguity...');
    const ambiguityOutput = await flowsService.generateCompletion('ORCHESTRATOR', ambiguitySystemPrompt, ambiguityUserPrompt);
    const cleanedAmbiguityOutput = flowsService.cleanJson(ambiguityOutput);
    
    let questions: string[] = [];
    try {
      questions = JSON.parse(cleanedAmbiguityOutput);
      if (!Array.isArray(questions)) questions = [];
    } catch (error) {
      console.warn(FLOWS_MESSAGES.ERROR.INVALID_JSON_QUESTIONS);
    }

    return res.status(200).json({
      success: true,
      data: {
        sessionData,
        questions
      }
    });
  } catch (error) {
    next(error);
  }
};

export const completeFlow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionData, answers } = req.body;

    if (!sessionData) {
      return res.status(400).json({ success: false, message: FLOWS_MESSAGES.ERROR.SESSION_REQUIRED });
    }

    // ── Load both skill prompts in parallel ────────────────────────────────
    const [auditSystemPrompt, diagramSystemPrompt] = await Promise.all([
      flowsService.loadSkill('gap_audit'),
      flowsService.loadSkill('diagrams'),
    ]);

    const auditUserPrompt = `Flow Data:\n${JSON.stringify(sessionData, null, 2)}\n\nUser Clarifications:\n${JSON.stringify(answers || {}, null, 2)}\n\nPlease conduct a gap audit and return ONLY valid JSON with 'gaps' and 'edgeCases' arrays.`;
    const diagramUserPrompt = `Flow Data:\n${JSON.stringify(sessionData, null, 2)}\n\nClarifications:\n${JSON.stringify(answers || {}, null, 2)}\n\nPlease generate activity and stateMachine diagrams plus Database Schema. Return ONLY valid JSON.`;

    // ── Run WRITER (audit) and ILLUSTRATOR (diagrams) in PARALLEL ──────────
    console.log('[completeFlow] Launching Gap Audit + Diagrams in parallel...');
    const [auditOutput, diagramOutput] = await Promise.all([
      flowsService.generateCompletion('WRITER', auditSystemPrompt, auditUserPrompt),
      flowsService.generateCompletion('ILLUSTRATOR', diagramSystemPrompt, diagramUserPrompt),
    ]);
    console.log('[completeFlow] Both agents finished.');

    const cleanedAuditOutput = flowsService.cleanJson(auditOutput);
    const cleanedDiagramOutput = flowsService.cleanJson(diagramOutput);

    let audit = { gaps: [], edgeCases: [] };
    try {
      audit = JSON.parse(cleanedAuditOutput);
    } catch (error) {
      console.warn(FLOWS_MESSAGES.ERROR.INVALID_JSON_AUDIT);
    }

    let result = { diagrams: { activity: '', stateMachine: '' }, schema: { tables: [] } };
    try {
      const parsed = JSON.parse(cleanedDiagramOutput);
      // Safely normalize — LLM sometimes returns objects or null instead of strings
      result = {
        diagrams: {
          activity: typeof parsed?.diagrams?.activity === 'string' ? parsed.diagrams.activity : '',
          stateMachine: typeof parsed?.diagrams?.stateMachine === 'string' ? parsed.diagrams.stateMachine : '',
        },
        schema: {
          tables: Array.isArray(parsed?.schema?.tables) ? parsed.schema.tables : [],
        },
      };
    } catch (error) {
      console.warn(FLOWS_MESSAGES.ERROR.INVALID_JSON_DIAGRAMS);
    }

    // Safely normalize audit fields
    if (!Array.isArray(audit.gaps)) audit.gaps = [];
    if (!Array.isArray((audit as any).edgeCases)) (audit as any).edgeCases = [];

    return res.status(200).json({
      success: true,
      data: {
        diagrams: result.diagrams,
        audit,
        schema: result.schema
      }
    });
  } catch (error) {
    next(error);
  }
};
