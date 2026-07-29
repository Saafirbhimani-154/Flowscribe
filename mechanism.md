# Core Mechanism: Flowscribe AI Processing

1. **Input:** User uploads an image of a hand-drawn flowchart.
2. **Analysis:** The Hono backend sends the image to a Vision LLM (e.g., Gemini 1.5 Pro).
3. **Extraction & Auditing:**
   - LLM extracts branches, nodes, and decision logic.
   - LLM audits for missing edge cases or contradictions.
4. **Generation:** 
   - Generates Mermaid.js syntax for Activity, State, and Data Flow diagrams.
   - Proposes a relational database schema.
5. **Output:** Frontend renders the diagrams and presents the Gap Report.
