import styles from "./Button.module.css";
import { Spinner } from "../spinner/Spinner";
import React, { useEffect, MouseEventHandler } from "react";

export const Button = ({
  style,
  innerStyle,
  iconStyle,
  backgroundColor,
  icon,
  inactive,
  text,
  tabindex,
  loading,
  onClick,
}: {
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  backgroundColor?: string;
  icon?: any;
  inactive?: boolean;
  tabindex?: number;
  onClick?: Function;
  loading?: boolean;
  text?: string;
}) => {
  return (
    <button
      style={{
        opacity: inactive ? 0.4 : 1,
        ...style,
      }}
      className={styles.wrapper}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}
        tabIndex={tabindex}
        className={styles.container}
        style={{
          ...innerStyle,
          background: backgroundColor,
          pointerEvents: inactive || loading ? "none" : "all",
        }}
      >
        <div
          className={styles.iconContainer}
          style={{ marginRight: icon && text && "8px", ...iconStyle }}
        >
          {loading ? <Spinner small={text && icon ? false : true} /> : icon}
        </div>
        {!loading && <p>{text}</p>}
      </div>
    </button>
  );
};
