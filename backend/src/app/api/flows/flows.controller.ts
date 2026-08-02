import { Request, Response, NextFunction } from 'express';
import { flowsService } from './flows.service';
import { FlowSessionData } from './flows.interface';
import { FLOWS_MESSAGES } from './flows.constants';

export const analyzeFlow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: FLOWS_MESSAGES.ERROR.NO_IMAGES });
    }

    const imagesBase64 = files.map(file => file.buffer.toString('base64'));

    const { context } = req.body;
    
    const visionSystemPrompt = await flowsService.loadSkill('vision_extract');
    let userPrompt = "Please extract the logical process flow from these images and return ONLY valid JSON matching the specified schema.";
    
    if (context && context.trim() !== '') {
      userPrompt = `User's Additional Context: "${context.trim()}"\n\n${userPrompt}`;
    }
    
    console.log('[analyzeFlow] Calling LLM Vision...');
    const visionOutput = await flowsService.generateCompletion(visionSystemPrompt, userPrompt, imagesBase64);
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
    const ambiguityOutput = await flowsService.generateCompletion(ambiguitySystemPrompt, ambiguityUserPrompt);
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

    const auditSystemPrompt = await flowsService.loadSkill('gap_audit');
    const auditUserPrompt = `Flow Data:\n${JSON.stringify(sessionData, null, 2)}\n\nUser Clarifications:\n${JSON.stringify(answers || {}, null, 2)}\n\nPlease conduct a gap audit and return ONLY valid JSON with 'gaps' and 'edgeCases' arrays.`;
    
    console.log('[completeFlow] Calling LLM Gap Audit...');
    const auditOutput = await flowsService.generateCompletion(auditSystemPrompt, auditUserPrompt);
    const cleanedAuditOutput = flowsService.cleanJson(auditOutput);
    
    let audit = { gaps: [], edgeCases: [] };
    try {
      audit = JSON.parse(cleanedAuditOutput);
    } catch (error) {
      console.warn(FLOWS_MESSAGES.ERROR.INVALID_JSON_AUDIT);
    }

    const diagramSystemPrompt = await flowsService.loadSkill('diagrams');
    const diagramUserPrompt = `Flow Data:\n${JSON.stringify(sessionData, null, 2)}\n\nClarifications:\n${JSON.stringify(answers || {}, null, 2)}\n\nPlease generate Mermaid diagrams (activity, stateMachine) and Database Schema tables. Return ONLY valid JSON.`;
    
    console.log('[completeFlow] Calling LLM Diagrams...');
    const diagramOutput = await flowsService.generateCompletion(diagramSystemPrompt, diagramUserPrompt);
    const cleanedDiagramOutput = flowsService.cleanJson(diagramOutput);
    
    let result = { diagrams: { activity: '', stateMachine: '' }, schema: { tables: [] } };
    try {
      result = JSON.parse(cleanedDiagramOutput);
    } catch (error) {
      console.warn(FLOWS_MESSAGES.ERROR.INVALID_JSON_DIAGRAMS);
    }

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
