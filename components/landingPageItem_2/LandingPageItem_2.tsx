import React from "react";
import { MdGroup, MdPublic } from "react-icons/md";
import { Button } from "../button/Button";
import styles from "./landingPageItem_2.module.css";

export const LandingPageItem_2 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2>Keep your information private</h2>
        <h1>Simple, strong privacy controls</h1>
        <p style={{lineHeight: "3rem"}}>
          All your information is private by default. You decide who gets
          access.
        </p>
      </div>
      <div className={styles.privacyContainer}>
        <Button
          style={{ width: "fit-content" }}
          icon={<MdGroup />}
          innerStyle={{ padding: "0 15px" }}
          text="Contacts"
        />
        <Button
          style={{ width: "fit-content", alignSelf: "flex-end" }}
          icon={<MdPublic />}
          innerStyle={{ padding: "0 15px" }}
          text="Public"
        />
      </div>
    </div>
  );
};
