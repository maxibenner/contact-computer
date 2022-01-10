import React from "react";
import { Border } from "../border/Border";
import { Logo } from "../logo/Logo";
import styles from "./wrapper.module.css";

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      <div style={{ position: "absolute", top: 8, left: 8 }}>
        <Logo />
      </div>
      {children}
      <Border />
    </div>
  );
};
