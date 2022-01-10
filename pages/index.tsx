import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState, useContext } from "react";
import { FieldsContext } from "../context/fieldsContext";
import { ContactCard } from "../components/contactCard/ContactCard";
import { Search } from "../components/search/Search";
import { ContactSearchResults } from "../components/contactSearchResults/ContactSearchResults";
import { Contact } from "../sdk/contacts";
import { Button } from "../components/button/Button";
import { getContactSearchResult } from "../sdk/db";
import Link from "next/link";

const Home: NextPage = () => {
  const { fields, addField } = useContext(FieldsContext);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);

  const handleSearch = () => {
    const data = getContactSearchResult();
    setContacts(data);
  };

  const handleSelect = (contact: Contact) => {
    setContacts([]);
    setSelected(contact);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Contact Computer</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {selected ? (
          <ContactCard
            onCancel={() => setSelected(null)}
            onAdd={addField}
            fields={fields}
            contact={selected}
          />
        ) : (
          <div style={{ width: "90%", maxWidth: "400px" }}>
            <h1
              style={{ color: "#454ef7", marginTop: "100px", fontSize: "4rem", marginBottom: "25px" }}
            >
              The global address book
            </h1>
            <Search onSearch={handleSearch} />
            <ContactSearchResults
              onSelect={handleSelect}
              contacts={contacts}
              style={{ margin: "10px 0" }}
            />
            {/* <Link href="/auth">
              <Button
                tabindex={0}
                style={{
                  height: "50px",
                  width: "100%",
                  margin: "0 auto",
                }}
                text="Add your contact info"
              />
            </Link> */}
          </div>
        )}
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
