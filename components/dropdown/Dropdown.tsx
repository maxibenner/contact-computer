import React from "react";
import { Button } from "../button/Button";

export const Dropdown = ({
  children,
  style,
  icon,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  icon: any;
}) => {
  return (
    <div style={style}>
      <Button icon={icon} />
      <div></div>
    </div>
  );
};
