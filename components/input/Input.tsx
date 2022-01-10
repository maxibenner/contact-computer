import React from "react";

export const Input = ({ style }: { style?: React.CSSProperties }) => {
  return <input style={{ ...internalStyles.container, ...style }} />;
};

const internalStyles = {
  container: {
    display: "block",
    height: "40px",
    width: "100%",
    border: "2px solid black",
    fontSize: "18px",
    padding: "0 8px"
  },
};
