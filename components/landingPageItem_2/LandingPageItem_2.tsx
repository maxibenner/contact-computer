import React from "react";
import {
  MdGroup, MdPublic
} from "react-icons/md";
import { Button } from "../button/Button";
import styles from "./landingPageItem_2.module.css";

export const LandingPageItem_2 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2>We prioritize privacy</h2>
        <h1>Simple, strong Privacy Controls</h1>
        <p>
          Choose for each piece of information if it is public, or for contacts
          only.
        </p>
      </div>
      <div className={styles.privacyContainer}>
        <Button
          style={{ width: "fit-content" }}
          icon={<MdGroup />}
          innerStyle={{ padding: "0 15px" }}
          text="Friends"
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
