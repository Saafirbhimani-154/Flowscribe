import type { Diagrams, AuditData, SchemaData } from '../types/flows.types';

export function generateProjectReadme(
  diagrams: Diagrams | null | undefined, 
  audit: AuditData | null | undefined, 
  schema: SchemaData | null | undefined
): string {
  let md = `# Project Documentation\n\n`;

  md += `## 1. Executive Summary\n`;
  md += `This document outlines the technical architecture, data flow, and identified edge cases for the project.\n\n`;

  md += `## 2. Architecture & Data Flow (Activity Diagram)\n`;
  if (diagrams?.activity) {
    md += `\`\`\`mermaid\n${diagrams.activity}\n\`\`\`\n\n`;
  } else {
    md += `*No activity diagram available.*\n\n`;
  }

  md += `## 3. State Management (State Machine)\n`;
  if (diagrams?.stateMachine) {
    md += `\`\`\`mermaid\n${diagrams.stateMachine}\n\`\`\`\n\n`;
  } else {
    md += `*No state machine diagram available.*\n\n`;
  }
  
  md += `## 4. Data Models (Database Schema)\n`;
  if (schema?.sql) {
    md += `\`\`\`sql\n${schema.sql}\n\`\`\`\n\n`;
  } else if (schema && Object.keys(schema).length > 0) {
    md += `\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\`\n\n`;
  } else {
    md += `*No database schema defined yet.*\n\n`;
  }

  md += `## 5. Edge Cases & Error Handling\n`;
  if (audit?.edgeCases?.length) {
    audit.edgeCases.forEach(edge => {
      const scenario = typeof edge === 'string' ? edge : edge.scenario;
      const res = typeof edge === 'object' && edge.resolution ? `\n  - **Resolution:** ${edge.resolution}` : '';
      md += `- **Scenario:** ${scenario}${res}\n`;
    });
    md += '\n';
  } else {
    md += `*No specific edge cases identified.*\n\n`;
  }

  md += `## 6. Logic Gaps & Security Considerations\n`;
  if (audit?.gaps?.length) {
    audit.gaps.forEach(gap => {
      const issue = typeof gap === 'string' ? gap : gap.issue;
      const rec = typeof gap === 'object' && gap.recommendation ? `\n  - **Recommendation:** ${gap.recommendation}` : '';
      md += `- **Issue:** ${issue}${rec}\n`;
    });
    md += '\n';
  } else {
    md += `*No logic gaps or vulnerabilities identified.*\n\n`;
  }

  md += `## 7. Tech Stack & Deployment Strategy\n`;
  md += `- **Frontend Stack:** React, TailwindCSS, TypeScript\n`;
  md += `- **Backend Stack:** Node.js, Express, Prisma ORM\n`;
  md += `- **Database & Auth:** PostgreSQL (Supabase)\n`;
  md += `- **Deployment Target:** Cloudflare Pages (Frontend) & Render (Backend)\n\n`;

  md += `---\n*Generated automatically by Flowscribe*\n\n`;

  return md;
}
