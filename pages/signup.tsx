import { NextPage } from "next";
import Head from "next/head";
import { Card } from "../components/card/Card";
import { Button } from "../components/button/Button";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import { InputText } from "../components/inputText/InputText";
import { useContext, useState } from "react";
import styles from "../styles/Home.module.css";
import { signUp } from "../sdk/auth";
import { NotificationContext } from "../context/NotificationContext";
import Router from "next/router";
import { Spinner } from "../components/spinner/Spinner";

const SignUp: NextPage = () => {
  const [password, onChangePassword] = useState("");
  const [email, onChangeEmail] = useState("");
  const [notification, setNotification] = useContext(NotificationContext);
  const [isLoading, setItsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setItsLoading(true);

    signUp(email, password, "http://localhost:3000/setup").then(
      ({ error, session, user }) => {
        if (error) {
          setItsLoading(false);
          // Error
          if (
            error.message === "Unable to validate email address: invalid format"
          ) {
            setNotification({
              title: "Error",
              description: "Please enter a valid email address.",
              type: "error",
              buttonText: "Ok",
            });
          } else if (error.message === "Signup requires a valid password") {
            setNotification({
              title: "Error",
              description: "Please choose a password to secure your account.",
              type: "error",
              buttonText: "Ok",
            });
          } else {
            // Uncaught error
            setNotification({
              title: "Error",
              description: error.message,
              type: "error",
              buttonText: "Ok",
            });
          }
        } else {
          // Success
          return Router.push(`/verification?email=${user?.email}`);
        }
      }
    );
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
          <h1 style={{ fontSize: "4rem" }}>Sign Up</h1>
          <form
            onSubmit={handleSignUp}
            noValidate
            name="Sign Up"
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
            }}
          >
            <InputText
              autoFocus
              label="Email"
              type="email"
              style={{ marginBottom: "15px" }}
              onChange={onChangeEmail}
              value={email}
            />
            <InputText
              value={password}
              type="password"
              label="Password"
              style={{ marginBottom: "30px" }}
              onChange={onChangePassword}
            />
            <Button
              icon={isLoading && <Spinner />}
              tabindex={0}
              style={{
                height: "50px",
                width: "100%",
                margin: "0 auto",
              }}
              text={!isLoading ? "Create Account" : undefined}
            />
            <Link href="/signin">
              <p
                style={{
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  width: "fit-content",
                  margin: "20px auto",
                }}
              >
                Sign In
              </p>
            </Link>
          </form>
        </Card>
      </main>
    </>
  );
};

export default SignUp;
