import React from "react";
import styles from "./imageUploaderButton.module.css";
import Image from "next/image";

/**
 * A button that displays an image a s a background
 * @returns JSX Element
 */
export const ImageUploaderButton = ({
  style,
  innerStyle,
  iconStyle,
  backgroundColor,
  icon,
  text,
  backgroundImage,
  tabindex,
  onClick,
}: {
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  backgroundColor?: string;
  icon?: any;
  backgroundImage?: any;
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
        style={{ ...innerStyle, background: backgroundColor }}
      >
        {backgroundImage ? (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Image objectFit="cover" layout="fill" src={backgroundImage} />
          </div>
        ) : (
          <div
            className={styles.iconContainer}
            style={{ marginRight: icon && text && "8px", ...iconStyle }}
          >
            {icon}
          </div>
        )}

        <p>{text}</p>
      </div>
    </button>
  );
};
