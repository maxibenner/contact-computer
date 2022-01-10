import React from "react";
import styles from "./Button.module.css";

export const Button = ({
  style,
  contentStyle,
  icon,
  text,
  tabindex,
  onClick,
}: {
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  icon?: any;
  tabindex?: number;
  onClick?: () => void;
  text?: string;
}) => {
  return (
    <button style={style} className={styles.wrapper}>
      <div
        onClick={onClick}
        tabIndex={tabindex}
        className={styles.container}
        style={contentStyle}
      >
        <div className={styles.iconContainer}>{icon}</div>
        <p>{text}</p>
      </div>
    </button>
  );
};
