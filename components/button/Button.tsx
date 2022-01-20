import styles from "./Button.module.css";
import { Spinner } from "../spinner/Spinner";

export const Button = ({
  style,
  innerStyle,
  iconStyle,
  backgroundColor,
  icon,
  inactive,
  text,
  tabindex,
  loading,
  onClick,
}: {
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  backgroundColor?: string;
  icon?: any;
  inactive?: boolean;
  tabindex?: number;
  onClick?: () => void;
  loading?: boolean;
  text?: string;
}) => {
  return (
    <button style={style} className={styles.wrapper}>
      <div
        onClick={onClick}
        tabIndex={tabindex}
        className={inactive ? styles.container_inactive : styles.container}
        style={{ ...innerStyle, background: backgroundColor }}
      >
        <div
          className={styles.iconContainer}
          style={{ marginRight: icon && text && "8px", ...iconStyle }}
        >
          {loading ? <Spinner small={text && icon ? false : true} /> : icon}
        </div>
        {!loading && <p>{text}</p>}
      </div>
    </button>
  );
};
