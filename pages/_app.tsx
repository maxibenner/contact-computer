import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MouseWrapper } from "../context/mouseContext";
import { NotificationWrapper } from "../context/NotificationContext";
import { Wrapper } from "../components/wrapper/Wrapper";
import { _dev_tools_ } from "../components/devTools/_dev_tools_";
import { AuthWrapper } from "../context/AuthContext";
import { ProfileWrapper } from "../context/ProfileContext";

function MyApp({ Component, pageProps }: AppProps) {
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
