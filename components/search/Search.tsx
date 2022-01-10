import { Button } from "../button/Button";
import styles from "./search.module.css";
import { MdSearch } from "react-icons/md";
import { getContactSearchResult } from "../../sdk/db";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Contact } from "../../sdk/contacts";

export const Search = ({ onResult }: { onResult: Function }) => {
  //   const [contacts, setContacts] = useState<Contact[]>();
  //   useEffect(() => {

  //     setContacts(data);
  //   }, []);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === "") {
      onResult([]);
    } else {
      const data = getContactSearchResult();
      onResult(data);
    }
  };

  return (
    <div className={styles.container}>
      <input
        placeholder="Search for people"
        style={{ display: "inline-block" }}
        onChange={handleInputChange}
      />
      {/* <Button
        icon={<MdSearch />}
        style={{
          position: "absolute",
          right: "10px",
        }}
      /> */}
    </div>
  );
};
