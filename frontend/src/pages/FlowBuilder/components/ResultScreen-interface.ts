import type React from 'react';
import type { Diagrams, AuditData, SchemaData } from '../../../types/flows.types';

export interface ResultScreenProps {
  activeTab: 'ACTIVITY' | 'STATE' | 'AUDIT' | 'SCHEMA';
  setActiveTab: React.Dispatch<React.SetStateAction<'ACTIVITY' | 'STATE' | 'AUDIT' | 'SCHEMA'>>;
  diagrams: Diagrams | null;
  audit: AuditData | null;
  schema: SchemaData | null;
  onNewChat?: () => void;
  activeSessionId?: string | null;
  /** When true the internal sidebar is hidden (parent already renders one) */
  hideSidebar?: boolean;
}
