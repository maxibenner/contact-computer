import React from "react";

export const Card = ({ children }: { children: React.ReactNode }) => {
  return <div style={styles.container}>{children}</div>;
};

const styles = {
  container: {
    backgroundColor: "white",
    width: "350px",
    boxShadow: "10px 10px 0 hsla(237, 20%, 62%, 1)",
    padding: "15px",
  },
};
