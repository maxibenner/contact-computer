import { getUser } from "../../sdk/auth";

export const _dev_tools_ = () => {
  const logUser = () => {
    const user = getUser();
    console.log(user);
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "25px",
        right: "25px",
        padding: "15px",
        // width: "100%",
        minHeight: "100px",
        backgroundColor: "white",
      }}
    >
      <h3>Dev Tools</h3>
      <button onClick={logUser}>Log user</button>
    </div>
  );
};
