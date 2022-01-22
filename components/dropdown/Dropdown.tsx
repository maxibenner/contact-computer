import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { Button } from "../button/Button";
import styles from "./dropdown.module.css";
import { useState, useEffect } from "react";

export const Dropdown = ({
  children,
  style,
  inactive,
  buttonStyle,
  innerButtonStyle,
  icon,
  outsideToggle,
  position = "bottom",
  noVisualChange,
  iconActive,
  loading = false,
}: {
  children: ReactNode;
  style?: CSSProperties;
  inactive?: boolean;
  buttonStyle?: CSSProperties;
  innerButtonStyle?: CSSProperties;
  icon: any;
  outsideToggle?: boolean;
  position?: "bottom" | "left";
  noVisualChange?: boolean;
  iconActive?: any;
  loading?: boolean;
}) => {
  const [isActive, setIsActive] = useState(false);

  // Trigger toggle from parent
  useEffect(() => {
    setIsActive(false);
  }, [outsideToggle]);

  const [backgroundColor, setBackgroundColor] = useState<string>();
  useEffect(() => {
    if (noVisualChange) return;
    if (inactive) setBackgroundColor("var(--color-grey)");
    else if (isActive) setBackgroundColor("var(--color-grey)");
    else setBackgroundColor("var(--color-main)");
  }, [isActive, inactive]);

  const handleToggle = () => !inactive && setIsActive((prev) => !prev);

  return (
    <div className={styles.container} style={style}>
      <Button
        loading={loading}
        inactive={inactive}
        icon={isActive ? (iconActive ? iconActive : icon) : icon}
        style={buttonStyle}
        innerStyle={innerButtonStyle}
        backgroundColor={backgroundColor}
        onClick={handleToggle}
      />
      {isActive && (
        <div
          className={
            position === "bottom" ? styles.menu_bottom : styles.menu_left
          }
        >
          {children}
        </div>
      )}
    </div>
  );
};
