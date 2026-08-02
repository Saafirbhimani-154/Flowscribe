// Sessions module — constants and error messages

export const SESSIONS_CONSTANTS = {
  MAX_TITLE_LENGTH: 100,
  MAX_MESSAGE_LENGTH: 5000,
  DEFAULT_TITLE: 'Untitled Flow',
};

export const SESSIONS_MESSAGES = {
  ERROR: {
    NOT_FOUND: 'Session not found.',
    UNAUTHORIZED: 'Unauthorized — session does not belong to this user.',
    MISSING_CONTENT: 'Message content is required.',
    MISSING_RESULT: 'diagrams, audit, and schema are required.',
  },
  SUCCESS: {
    CREATED: 'Session created successfully.',
    DELETED: 'Session deleted successfully.',
    RESULT_SAVED: 'Result saved successfully.',
    MESSAGE_ADDED: 'Message added successfully.',
  },
};
