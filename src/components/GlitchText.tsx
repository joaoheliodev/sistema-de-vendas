import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '', as: Tag = 'span' }) => {
  return (
    <Tag className={`glitch-text ${className}`} data-text={text}>
      {text}
    </Tag>
  );
};
