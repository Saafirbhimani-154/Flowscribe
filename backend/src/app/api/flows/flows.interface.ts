export interface FlowSessionData {
  nodes: any[];
  edges: any[];
  actors: any[];
  rawLLMOutput?: string;
}

export interface AnalyzeFlowRequest {
  imagesBase64: string[];
}

export interface CompleteFlowRequest {
  sessionData: FlowSessionData;
  answers: Record<string, string>;
}

export interface DiagramOutput {
  activity: string;
  stateMachine: string;
}

export interface AuditOutput {
  gaps: string[];
  edgeCases: string[];
}

export interface SchemaOutput {
  tables: any[];
}
