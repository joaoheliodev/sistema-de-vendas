import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'primary' | 'outline';
  pulse?: boolean;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  fullWidth,
  variant = 'outline',
  pulse,
  href,
  className = '',
  ...props
}) => {
  const base = `
    font-oswald uppercase italic px-8 py-4 text-lg md:text-xl font-bold tracking-wide
    transition-all duration-300 active:translate-y-0.5 rounded-none
    relative overflow-hidden group btn-sweep
  `;

  const variants = {
    outline: `
      border-2 border-neon bg-transparent text-white
      hover:bg-neon hover:text-dark hover:shadow-[0_0_24px_#CCFF0055,0_0_56px_#CCFF0022]
    `,
    primary: `
      border-2 border-neon bg-neon text-dark
      hover:bg-transparent hover:text-neon hover:shadow-[0_0_24px_#CCFF0055,0_0_56px_#CCFF0022]
    `,
  };

  const combinedClasses = `
    ${base} ${variants[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${pulse ? 'cta-pulse' : ''}
    ${className}
  `;

  const innerContent = (
    <>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      className={combinedClasses}
      {...props}
    >
      {innerContent}
    </button>
  );
};
