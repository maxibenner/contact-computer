import { Card } from "../card/Card";
import styles from "./landingPageItem_2.module.css";
import Image from "next/image";
import React from "react";
import { Button } from "../button/Button";
import { MdOutlineFavorite, MdPublic, MdBusiness } from "react-icons/md";

export const LandingPageItem_2 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2>We prioritize privacy</h2>
        <h1>Simple, strong Privacy Controls</h1>
        <p>
          Stay on top of what you share by putting your contacts into groups.
        </p>
      </div>
      <div className={styles.privacyContainer}>
        <Button
          style={{ width: "fit-content" }}
          icon={<MdOutlineFavorite />}
          innerStyle={{ padding: "0 15px" }}
          text="Friends"
        />
        <Button
          style={{ width: "fit-content", alignSelf: "center" }}
          icon={<MdBusiness />}
          innerStyle={{ padding: "0 15px" }}
          text="Work"
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
