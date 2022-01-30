import styles from "./speechBubble.module.css";
import { Button } from "../button/Button";
import { Radio } from "../radio/Radio";
import { useState, useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { motion } from "framer-motion";

export const SpeechBubble = ({
  title,
  description,
  type,
  buttonText,
  onClick,
}: {
  title: string;
  description: string;
  type: "error" | "info";
  buttonText?: string | undefined;
  onClick?: () => void | undefined;
}) => {
  const [notification, setNotification, doNotShowAgain, setDoNotShowAgain] =
    useContext(NotificationContext);

  /* ANIMATION */
  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  if (description) {
    return (
      <motion.div
        className={type === "error" ? styles.containerError : styles.container}
        initial="hidden"
        animate="visible"
        // transition={{ duration: 0.3 }}
        variants={variants}
      >
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.interactivesContainer}>
          {buttonText && onClick && (
            <Button
              onClick={onClick}
              backgroundColor={
                type === "error" ? "var(--color-error)" : "var(--color-main)"
              }
              innerStyle={{
                padding: "0 25px",
              }}
              text={buttonText}
            />
          )}
          {notification?.doNotShowAgainId && (
            <div
              className={styles.dontShowAgainContainer}
              onClick={() => setDoNotShowAgain()}
            >
              <Radio active={doNotShowAgain} />
              <p>Don&apos;t show this again</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  } else return null;
};
