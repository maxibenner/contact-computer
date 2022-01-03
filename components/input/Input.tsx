import React from "react";

export const Input = ({ styles }: { styles?: React.CSSProperties }) => {
  return <input style={{ ...internalStyles.container, ...styles }} />;
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
