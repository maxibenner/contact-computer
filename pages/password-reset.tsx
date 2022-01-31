import { NextPage } from "next";
import Head from "next/head";
import { Card } from "../components/card/Card";
import { Button } from "../components/button/Button";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import { InputText } from "../components/inputText/InputText";
import { FormEventHandler, useContext, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { signIn } from "../sdk/auth";
import { NotificationContext } from "../context/NotificationContext";
import { Spinner } from "../components/spinner/Spinner";
import Router from "next/router";
import { sendPasswordReset } from "../sdk/db";
import textStyles from "../styles/text.module.css";
import { AuthContext } from "../context/AuthContext";
import { updatePassword } from "../sdk/db";
import { useRouter } from "next/router";
import { ReactEventHandler } from "react";

const PasswordReset: NextPage = () => {
  const user = useContext(AuthContext);
  const [password, onChangePassword] = useState("");
  const [notification, setNotification] = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    setNotification(null);
  }, []);

  // Check query for password reset token coming from index
  useEffect(() => {
    const pathWithQuery = router.asPath;
    if (pathWithQuery.includes("?")) {
      const query = pathWithQuery.split("?")[1];
      const queryElements = query.split("&");
      for (let i = 0; i < queryElements.length; i++) {
        if (queryElements[i].includes("token")) {
          const split = queryElements[i].split("=");
          setToken(split[1]);
        }
      }
    }
  }, [router]);

  const handlePasswordUpdate = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (token) {
      console.log("start");
      const { data, error } = await updatePassword(password, token);

      if (error) {
        setIsLoading(false);
        setNotification({
          title: "Error",
          description: error.message,
          buttonText: "Ok",
          type: "error",
        });
      } else {
        router.push("/profile");
      }
    }
  };

  return (
    <>
      <Head>
        <title>Contact Computer</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card style={{ margin: "10vh 35px 70px 35px" }}>
          <Link href="/">
            <a>
              <Button
                icon={<MdArrowBack />}
                style={{ position: "absolute", top: -20, left: -20 }}
              />
            </a>
          </Link>
          <h1 style={{ fontSize: "4rem" }}>Password reset</h1>
          <form
            name="Password reset"
            onSubmit={handlePasswordUpdate}
            noValidate
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
            }}
          >
            <p style={{ margin: "0 0 20px 0", fontSize: "1.8rem" }}>
              Choose a new password.
            </p>

            <InputText
              value={password}
              type="password"
              label="New password"
              onChange={onChangePassword}
            />

            <Button
              tabindex={0}
              icon={isLoading && <Spinner />}
              style={{
                height: "50px",
                width: "100%",
                margin: "25px auto 0 auto",
              }}
              text={!isLoading ? "Reset" : undefined}
            />
          </form>
        </Card>
      </main>
    </>
  );
};

export default PasswordReset;
