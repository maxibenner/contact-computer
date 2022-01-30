import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MouseWrapper } from "../context/mouseContext";
import { NotificationWrapper } from "../context/NotificationContext";
import { Wrapper } from "../components/wrapper/Wrapper";
// import { _dev_tools_ } from "../components/devTools/_dev_tools_";
import { AuthWrapper } from "../context/AuthContext";
import { ProfileWrapper } from "../context/ProfileContext";

function MyApp({ Component, pageProps }: AppProps) {
  // return (
  //   <div
  //     style={{
  //       display: "flex",
  //       flexDirection: "column",
  //       width: "500px",
  //       maxWidth: "90vw",
  //       color: "white",
  //       position: "absolute",
  //       top: "43%",
  //       left: "50%",
  //       transform: "translate(-50%, -50%)",
  //     }}
  //   >
  //     <div style={{ fontSize: "4.8rem" }}>🚧</div>
  //     <h1 style={{ margin: "10px 0", lineHeight: "5rem", fontSize: "4.8rem" }}>
  //       Scheduled maintenance
  //     </h1>
  //     <p style={{ margin: 0, fontSize: "2.5rem" }}>
  //       We will be back later today.
  //     </p>
  //   </div>
  // );
  return (
    <AuthWrapper>
      <NotificationWrapper>
        <ProfileWrapper>
          <MouseWrapper>
            <Wrapper>
              <Component {...pageProps} />
              {/* <_dev_tools_ /> */}
            </Wrapper>
          </MouseWrapper>
        </ProfileWrapper>
      </NotificationWrapper>
    </AuthWrapper>
  );
}

export default MyApp;
