import React from "react";
import styles from "./Button.module.css";

export const Button = ({
  style,
  icon,
  text,
  tabindex,
  onClick,
  ...rest
}: {
  style?: React.CSSProperties;
  icon?: any;
  tabindex?: number;
  onClick?: () => void;
  text?: string;
}) => {
  return (
    <div style={style} className={styles.wrapper}>
      <div onClick={onClick} tabIndex={tabindex} className={styles.container}>
        <div className={styles.iconContainer}>{icon}</div>
        <p>{text}</p>
      </div>
    </div>
  );
};
