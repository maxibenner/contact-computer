import { ReactNode, useState } from "react";
import { Button } from "../button/Button";
import styles from "./mobileMenu.module.css";
import { MdMenu, MdMenuOpen } from "react-icons/md";

export const MobileMenu = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <div className={styles.wrapper_mobile} onClick={() => setIsActive(false)}>
        <Button
          style={{ height: "50px", width: "50px" }}
          icon={isActive ? <MdMenuOpen /> : <MdMenu />}
          onClick={() => setIsActive((prev) => !prev)}
        />
        <div
          className={styles.container}
          style={{ transform: isActive ? "translateX(0)" : "translateX(100%)" }}
        >
          {children}
        </div>
      </div>
      <div className={styles.wrapper_desktop}>{children}</div>
    </>
  );
};
