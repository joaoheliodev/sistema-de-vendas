import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'primary' | 'outline';
  pulse?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  fullWidth,
  variant = 'outline',
  pulse,
  className = '',
  ...props
}) => {
  const base = `
    font-oswald uppercase italic px-8 py-4 text-lg md:text-xl font-bold
    transition-all duration-300 active:translate-y-0.5 rounded-none
    relative overflow-hidden group
  `;

  const variants = {
    outline: `
      border-2 border-neon bg-transparent text-white
      hover:bg-neon hover:text-dark hover:shadow-[0_0_30px_#CCFF0066,0_0_60px_#CCFF0022]
    `,
    primary: `
      border-2 border-neon bg-neon text-dark
      hover:bg-transparent hover:text-neon hover:shadow-[0_0_30px_#CCFF0066,0_0_60px_#CCFF0022]
    `,
  };

  return (
    <button
      className={`
        ${base} ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${pulse ? 'cta-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};
