import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import localStyles from "../styles/index.module.css";
import { useState, useEffect, useContext } from "react";
import { Search } from "../components/search/Search";
import { ContactSearchResults } from "../components/contactSearchResults/ContactSearchResults";
import { ContactType } from "../sdk/db";
import { db_getContactSearchResult } from "../sdk/db";
import Router from "next/router";
import { NotificationContext } from "../context/NotificationContext";
import { AuthContext } from "../context/AuthContext";
import { LandingPageItem_1 } from "../components/landingPageItem_1/LandingPageItem_1";
import { LandingPageItem_2 } from "../components/landingPageItem_2/LandingPageItem_2";
import { LandingPageItem_3 } from "../components/landingPageItem_3/LandingPageItem_3";

const Home: NextPage = () => {
  const [contacts, setContacts] = useState<any>([]);
  const user = useContext(AuthContext);

  const [notification, setNotification] = useContext(NotificationContext);

  const handleSearch = async (d: string) => {
    if (d.length > 3) {
      const { data, error } = await db_getContactSearchResult(d);
      setContacts(data);
    }
  };

  const handleSelect = (contact: ContactType) => {
    setContacts([]);

    // Send user to profile on self-select, otherwise, send to contact-page
    if (user && user.id === contact.id) Router.push(`/profile`);
    else Router.push(`/contact-page?u=${contact.id}&o=/`);
  };

  // Give info to user
  useEffect(() => {
    setNotification({
      title: "Hey there!",
      description:
        "My name is Contact Computer. I'm a privacy focused, global address book that is always up to date.",
      type: "info",
      buttonText: "Sounds good",
      doNotShowAgainId: "intro_1",
    });
  }, []);

  return (
    <>
      <Head>
        <title>Contact Computer</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={localStyles.containerHero}>
          <h1 className={styles.heroText}>The global address book</h1>
          <Search onSearch={handleSearch} />
          <ContactSearchResults
            onSelect={handleSelect}
            contacts={contacts}
            style={{ margin: "10px 0" }}
          />
        </div>
        <div className={localStyles.containerItem}>
          <LandingPageItem_1 />
        </div>
        <div className={localStyles.containerItem}>
          <LandingPageItem_2 />
        </div>
        <div
          className={localStyles.containerItem}
          style={{ margin: "10vh 35px 20vh 35px" }}
        >
          <LandingPageItem_3 />
        </div>
        <footer className={localStyles.footer}>
          Copyright © 2022
          <a
            href="https:///www.fotura.co"
            style={{
              margin: "0 5px",
              textDecoration: "underline",
              height: "fit-content",
            }}
            target="_empty"
          >
            Fotura, Inc.
          </a>
          All rights reserved.
        </footer>
      </main>
    </>
  );
};

export default Home;
