import React from "react";

const EditText = ({
  type = "text",
  placeholder = "",
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  id,
  autoComplete,
  maxLength,
  className = "",
  ...props
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      autoComplete={autoComplete}
      maxLength={maxLength}
      className={`
        w-full
        px-3 py-2
        rounded-sm
        border border-border-light
        bg-background-card
        text-text-primary
        text-sm
        placeholder:text-text-secondary
        focus:outline-none
        focus:border-primary-background
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  );
};

export default EditText;