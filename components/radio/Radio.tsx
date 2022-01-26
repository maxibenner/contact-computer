import styles from "./radio.module.css";
import { ImCheckmark } from "react-icons/im";

export const Radio = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick?: Function;
}) => {
  return (
    <div
      className={active ? styles.wrapper_active : styles.wrapper}
      onClick={() => onClick && onClick()}
    >
      <ImCheckmark />
    </div>
  );
};
