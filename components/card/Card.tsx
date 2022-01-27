import { CSSProperties, ReactNode } from "react";

import styles from "./card.module.css";

export const Card = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <div className={styles.container} style={style}>
      {children}
    </div>
  );
};
