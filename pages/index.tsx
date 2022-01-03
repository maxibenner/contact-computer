import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Card } from "../components/card/Card";
import { Input } from "../components/input/Input";
import { Border } from "../components/border/Border";
import { Dropdown } from "../components/dropdown/Dropdown";
import { MdPublic, MdEdit, MdAdd, MdSave } from "react-icons/md";
import { Button } from "../components/button/Button";
import { InlineEdit } from "../components/inlineEdit/InlineEdit";
import React, { useState, useEffect, ChangeEvent } from "react";

const data = [
  {
    name: "Home",
    categorie: "phone",
    value: "+1 (929) 353-8426",
    access: "public",
  },
  {
    name: "Office",
    categorie: "phone",
    value: "+1 (834) 123-3214",
    access: "friends",
  },
];
const Home: NextPage = () => {
  const [fields, setFields] = useState(data);
  const handleFieldChange = ({ i, e }: { i: number; e: string }) => {
    console.log(e)
    // const fieldsNew = [...fields];
    // fieldsNew[i].value = value;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Contact Computer</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Border />
      <main className={styles.main}>
        <Card>
          <h2 style={{ color: "#454ef7", fontSize: "2.4rem", marginTop: 0 }}>
            Maximilian Benner
          </h2>
          <h3>Phone</h3>
          {fields.map((field, i) => {
            return (
              <div style={{ display: "flex", marginTop: "8px" }}>
                <InlineEdit
                  value={fields[i].value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFieldChange({ i, e })
                  }
                  // onSave={(value: string) => handleFieldSave({ i, value })}
                  iconStart={<MdEdit />}
                  iconEnd={<MdSave />}
                />
                <Dropdown icon={<MdPublic />} style={{ marginLeft: "5px" }}>
                  <h3>Test</h3>
                </Dropdown>
              </div>
            );
          })}

          <Button
            onClick={() =>
              setFields((prev) => [
                ...prev,
                {
                  name: "",
                  categorie: "phone",
                  value: "",
                  access: "public",
                },
              ])
            }
            style={{ width: "100%", marginTop: "8px" }}
            icon={<MdAdd />}
          />
        </Card>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
