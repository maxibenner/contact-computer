import { Card } from "../card/Card";
import styles from "./landingPageItem_4.module.css";
import Image from "next/image";
import React from "react";
import { MdShield } from "react-icons/md";
import { FaLock } from "react-icons/fa";

export const LandingPageItem_4 = () => {
  return (
    <div className={styles.container}>
      <Card
        style={{
          transform: "rotate(5deg)",
          maxWidth: "280px",
          padding: 0,
          backgroundColor: "var(--color-main)",
        }}
      >
        <div className={styles.cardInner}>
          <div className={styles.imageContainer}>
            <Image objectFit="cover" layout="fill" src="/landing_profile.jpg" />
          </div>
          <h1 style={{ fontSize: "2.8rem", margin: 0 }}>Jasha Muller</h1>
        </div>
        <div className={styles.cardInfoContainer}>
          <div className={styles.lockBg}>
            <FaLock />
          </div>
        </div>
      </Card>
      <div className={styles.textContainer}>
        <h2>Stay in control of your data</h2>
        <h1>We care about data protection</h1>
        <p style={{ lineHeight: "3rem" }}>
          We don&apos;t personalize ads. We don&apos;t sell data. You are in control.
        </p>
      </div>
    </div>
  );
};
