import styles from "./speechBubble.module.css";
import { Button } from "../button/Button";

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
  if (description) {
    return (
      <div
        className={type === "error" ? styles.containerError : styles.container}
      >
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        {buttonText && onClick && (
          <Button
            onClick={onClick}
            backgroundColor={
              type === "error" ? "var(--color-error)" : "var(--color-main)"
            }
            innerStyle={{
              padding: "0 25px",
            }}
            style={{ margin: "0 0 0 auto" }}
            text={buttonText}
          />
        )}
      </div>
    );
  } else return null;
};
