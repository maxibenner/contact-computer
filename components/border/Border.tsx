export const Border = () => {
  return <div style={localStyle.container} />;
};

const localStyle = {
  container: {
    border: "10px solid #454ef7",
    position: "fixed",
    width: "100vw",
    height: "100vh",
    top: 0,
    left: 0,
    zIndex: 9999,
    pointerEvents: "none",
  },
};
