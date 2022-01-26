import styles from "./speechBubble.module.css";
import { Button } from "../button/Button";
import { Radio } from "../radio/Radio";
import { useState, useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";

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

  if (description) {
    return (
      <div
        className={type === "error" ? styles.containerError : styles.container}
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
          <div
            className={styles.dontShowAgainContainer}
            onClick={() => setDoNotShowAgain()}
          >
            <Radio active={doNotShowAgain} />
            <p>Don&apos;t show this again</p>
          </div>
        </div>
      </div>
    );
  } else return null;
};
