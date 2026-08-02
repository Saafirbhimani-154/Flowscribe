import type React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface AnimatedMeshBackgroundProps {
  colors?: [string, string];
  reverse?: boolean;
}

export interface NeumorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  error?: string;
}

export interface NeumorphicTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon: LucideIcon;
  error?: string;
}

export interface SocialAuthButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface MagneticDockProps {
  items: {
    title: string;
    icon?: React.ElementType;
    href?: string;
    badge?: number;
    isSeparator?: boolean;
  }[];
}
