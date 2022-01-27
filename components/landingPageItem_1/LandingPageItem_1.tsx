import { Card } from "../card/Card";
import styles from "./landingPageItem_1.module.css";
import Image from "next/image";
import React from "react";

export const LandingPageItem_1 = () => {
  return (
    <div className={styles.container}>
      <Card style={{ transform: "rotate(-5deg)", maxWidth: "280px" }}>
        <div className={styles.cardInner}>
          <div className={styles.imageContainer}>
            <Image objectFit="cover" layout="fill" src="/landing_profile.jpg" />
          </div>
          <h1 style={{ fontSize: "2.8rem", margin: 0 }}>Jasha Muller</h1>
        </div>
        <div
          className={styles.cardInfoContainer}
          style={{ display: "flex", flexDirection: "column", color: "black" }}
        >
          <h2>Email</h2>
          <p className={styles.label}>Work</p>
          <p>jasha.m@office.com</p>
          <h2>Web</h2>
          <p className={styles.label}>Portfolio</p>
          <p>www.jashamuller.com</p>
        </div>
      </Card>
      <div className={styles.textContainer}>
        <h2>Keep everyone in the loop</h2>
        <h1>
          Your Contact Info <u>save</u> on the web
        </h1>
        <p>Fill out your personal card to help your contacts stay in touch.</p>
      </div>
    </div>
  );
};
