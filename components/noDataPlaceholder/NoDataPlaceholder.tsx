import styles from "./noDataPlaceholder.module.css";
import { CSSProperties } from "react";

export const NoDataPlaceholder = ({
  text,
  style,
}: {
  text: string;
  style?: CSSProperties;
}) => {
  return (
    <div className={styles.noDataContainer} style={style}>
      <p>{text}</p>
    </div>
  );
};
