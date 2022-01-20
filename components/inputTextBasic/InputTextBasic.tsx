import React, { useState } from "react";
import s from "./inputTextBasic.module.css";

export const InputTextBasic = ({
  onChange,
  disabled = false,
  onClick,
  onDelete,
  onFocus,
  onBlur,
  placeholder,
  label,
  value,
  maxLength,
  style,
  type,
  required,
  autoComplete,
  autoFocus,
  autoCorrect,
  spellCheck,
  ...props
}: {
  onChange?: any;
  disabled?: boolean;
  onClick?: any;
  onDelete?: any;
  onFocus?: any;
  onBlur?: any;
  placeholder?: string;
  label?: string;
  value?: string;
  maxLength?: number;
  style?: React.CSSProperties;
  type?: "text" | "password" | "email";
  autoComplete?: string;
  autoFocus?: boolean;
  autoCorrect?: string;
  spellCheck?: boolean;
  required?: boolean;
}) => {
  const [id, setId] = useState<string>();

  return (
    <div style={style} className={s.container}>
      <input
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        spellCheck={spellCheck}
        disabled={disabled}
        autoFocus={autoFocus}
        required={required}
        {...props}
        id={id}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
        type={type ? type : "text"}
        className={disabled ? s.input_disabled : s.input}
        maxLength={maxLength}
        value={value}
      />
    </div>
  );
};
