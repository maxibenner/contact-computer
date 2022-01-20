import React from "react";
import { NavBar } from "../navBar/NavBar";
import styles from "./wrapper.module.css";

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      {children}
      <div className={styles.border} />
      <NavBar />
    </div>
  );
};
