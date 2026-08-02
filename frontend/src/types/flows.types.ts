export interface SessionData {
  title?: string;
  nodes: any[];
  edges: any[];
  actors?: any[];
}

export interface GapItem {
  issue: string;
  recommendation?: string;
}

export interface EdgeCaseItem {
  scenario: string;
  resolution?: string;
}

export interface AuditData {
  gaps: (string | GapItem)[];
  edgeCases: (string | EdgeCaseItem)[];
}

export interface SchemaData {
  tables: any[];
}

export interface Diagrams {
  activity: string;
  stateMachine: string;
}

export type FlowBuilderStep = 'UPLOAD' | 'QUESTIONS' | 'RESULTS';
