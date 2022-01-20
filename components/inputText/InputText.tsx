import React, { useState } from "react";
import s from "./inputText.module.css";

export const InputText = ({
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
  link,
  name,
  onLinkClick,
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
  value?: string | null;
  maxLength?: number;
  style?: React.CSSProperties;
  type?: "text" | "password" | "email" | "file";
  autoComplete?: string;
  autoFocus?: boolean;
  autoCorrect?: string;
  spellCheck?: boolean;
  link?: string;
  name?: string;
  onLinkClick?: Function;
  required?: boolean;
}) => {
  const [id, setId] = useState<string>();
  const [content, setContent] = useState<string>("");

  // Pass value to parent
  const handleChange = (e: any) => {
    onChange(e.target.value);
    setContent(e.target.value);
  };

  return (
    <div style={style} className={s.container}>
      <input
        name={name}
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
        onChange={handleChange}
        type={type ? type : "text"}
        className={disabled ? s.input_disabled : s.input}
        maxLength={maxLength}
        value={content}
      />
      <span className={`${s.label} ${content.length > 0 && s.label_focus}`}>
        {label}
      </span>
    </div>
  );
};
