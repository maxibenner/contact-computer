import React from "react";
import { Button } from "../button/Button";
import styles from "./landingPageItem_3.module.css";
import { useRouter } from "next/router";

export const LandingPageItem_3 = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <h1>Join now</h1>
      <p>
        Set up your central identity on the web and start connecting with
        others.
      </p>
      <Button
        onClick={() => router.push("/signup")}
        text="Let's get started"
        innerStyle={{ padding: "0 25px" }}
        style={{ height: "50px" }}
      />
    </div>
  );
};
