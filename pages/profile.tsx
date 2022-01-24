import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { ContactCard } from "../components/contactCard/ContactCard";
import { AuthContext } from "../context/AuthContext";
import { ProfileContext } from "../context/ProfileContext";
import styles from "../styles/Home.module.css";

export default function Profile() {
  const router = useRouter();
  const user = useContext(AuthContext);

  // Profile context functions
  const { profile } = useContext(ProfileContext);

  return (
    <div className={styles.container}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {profile && (
          <ContactCard
            relationship="self"
            style={{ margin: "10vh 35px 70px 35px" }}
            backHref={typeof router.query.o === "string" ? router.query.o : "/"}
            contact={profile}
            user={user}
          />
        )}
      </main>
    </div>
  );
}
