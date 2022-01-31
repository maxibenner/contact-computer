import { NextPage } from "next";
import Head from "next/head";
import { Card } from "../components/card/Card";
import textStyles from "../styles/text.module.css";
import styles from "../styles/Home.module.css";

const WaitingForResetEmail: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contact Computer</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card style={{ margin: "10vh 35px 70px 35px", paddingBottom: "60px" }}>
          <h1 style={{ fontSize: "4rem" }}>Reset email sent</h1>
          <p className={textStyles.bodyLight}>
            Just click the link in the email to create a new password. If you
            don&apos;t see it, you may need to{" "}
            <b className={textStyles.bodyRegular}>check your spam folder</b>.
          </p>
        </Card>
      </main>
    </>
  );
};

export default WaitingForResetEmail;
