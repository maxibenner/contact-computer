import React from "react";
import styles from "./Button.module.css";

export const Button = ({
  style,
  icon,
  text,
  onClick,
  ...rest
}: {
  style?: React.CSSProperties;
  icon?: any;
  onClick?: () => void;
  text?: string;
}) => {
  return (
    <div
      onClick={onClick}
      // tabIndex={0}
      style={style}
      className={styles.container}
    >
      <div className={styles.iconContainer}>{icon}</div>
      <p>{text}</p>
    </div>
  );
};
