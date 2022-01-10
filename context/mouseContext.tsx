import React, { createContext, useState, useEffect } from "react";

export const MouseContext = createContext([0, 0]);

export const MouseWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mousePos, setMousePos] = useState([0, 0]);
  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleMouseMove = ({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }) => {
    setMousePos([clientX, clientY]);
  };

  return (
    <MouseContext.Provider value={mousePos}>{children}</MouseContext.Provider>
  );
};
