import React from "react";

export const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return <div style={{ ...styles.container, ...style }}>{children}</div>;
};

const styles = {
  container: {
    position: "relative",
    backgroundColor: "white",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "10px 10px 0px hsla(237, 20%, 62%, 1)",
    padding: "30px",
  },
};
