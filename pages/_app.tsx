import "../styles/globals.css";
import type { AppProps } from "next/app";
import { FieldsWrapper } from "../context/fieldsContext";
import { MouseWrapper } from "../context/mouseContext";
import { Wrapper } from "../components/wrapper/Wrapper";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MouseWrapper>
      <FieldsWrapper>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </FieldsWrapper>
    </MouseWrapper>
  );
}

export default MyApp;
