'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface KatexViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const KatexView: React.FC<KatexViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math, block]);

  return (
    <span
      className={`inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
