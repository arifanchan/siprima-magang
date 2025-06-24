/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface FilePreviewButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  children?: ReactNode; // icon
}

export default function FilePreviewButton({ label, onClick, className = '', children }: FilePreviewButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className={`flex items-center gap-1 px-2 py-1 text-primary border-border transition-colors duration-150 hover:bg-neutral-800 hover:text-white focus:ring-2 focus:ring-primary dark:hover:bg-neutral-700 dark:hover:text-white ${className}`}
      onClick={onClick}
    >
      {children}
      <span className="ml-1 whitespace-nowrap">{label}</span>
    </Button>
  );
}
