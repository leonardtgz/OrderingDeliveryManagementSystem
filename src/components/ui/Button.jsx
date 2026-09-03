import React from "react";

const Button = ({
  children,
  text,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-primary-background text-primary-foreground hover:bg-primary-background/90",
    secondary:
      "bg-secondary-background text-text-primary hover:bg-secondary-light",
    outline:
      "border-2 border-primary-background bg-transparent text-primary-background hover:bg-primary-background hover:text-primary-foreground",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        px-4 py-2
        rounded-sm
        text-sm font-semibold
        transition-colors duration-200
        focus:outline-none
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${className}
      `}
      {...props}
    >
      {children || text}
    </button>
  );
};

export default Button;