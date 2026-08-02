// Flows frontend types & interfaces (mirrors flows.types.ts in src/types)
// These are the API payload/response shapes for the flows service

export interface UploadedFile {
  id: string;
  filename: string;
  path: string;
}

export interface FlowAnalyzeResponse {
  sessionData: import('../../types/flows.types').SessionData;
  questions: string[];
}

export interface FlowCompleteResponse {
  diagrams: import('../../types/flows.types').Diagrams;
  audit: import('../../types/flows.types').AuditData;
  schema: import('../../types/flows.types').SchemaData;
}
