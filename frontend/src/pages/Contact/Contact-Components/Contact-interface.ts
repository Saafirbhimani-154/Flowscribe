import type React from 'react';

export interface ContactFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, data: { name: string; email: string; message: string }) => void;
  isLoading?: boolean;
}

export interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}
