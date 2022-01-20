import styles from "./spinner.module.css";
import { useState } from "react";

export const Spinner = ({ small }: { small?: boolean }) => {
  const [className, setClassname] = useState(
    small ? styles.smallContainer : styles.container
  );

  return (
    <div className={className}>
      <div />
      <div />
      {!small && <div />}
    </div>
  );
};
