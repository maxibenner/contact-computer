import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ContactCard } from "../components/contactCard/ContactCard";
import { useContext, useState, useEffect } from "react";
import { supabase } from "../sdk/supabase";
import { User } from "@supabase/supabase-js";
import { NotificationContext } from "../context/NotificationContext";
import {
  getContact,
  saveContactInfo,
  deleteContactInfo,
  sendContactRequest,
} from "../sdk/db";
import { useRouter } from "next/router";

export default function Contact({
  user,
  data,
}: {
  user: User | null;
  data: ContactType;
}) {
  const [savedData, setSavedData] = useState(data);
  const router = useRouter();

  const [notification, setNotification] = useContext(NotificationContext);

  // Toggle this state to re-enable the "add field" option on the contact card
  const [doneSaving, setDoneSaving] = useState(false);

  // Save data to database
  const handleSave = async ({
    data,
    type,
  }: {
    data: SingleLineData | AddressData;
    type: "phone" | "email" | "web" | "address";
  }) => {
    // User primary key of already existing data or remove key for auto generation for new data
    data.owner_id = user?.id || null;
    if (typeof data.id === "string") {
      if (data.id.includes("local")) delete data.id;
    }

    // Save data
    const saveRes = await saveContactInfo({ data, type });
    console.log(saveRes?.error);

    // Reload data
    reloadData();
  };

  const reloadData = async () => {
    const uid = (router.query.u as string) || user?.id || null;

    if (uid) {
      const { data, error } = await getContact(uid);
      if (data) setSavedData(data);
    }

    setDoneSaving((prev) => !prev);
  };

  const handleDelete = async ({
    data,
    type,
  }: {
    data: SingleLineData | AddressData;
    type: "phone" | "email" | "web" | "address";
  }) => {
    await deleteContactInfo({ data, type });
    // Reload data
    reloadData();
  };

  // Handle contact request
  const handleRequest = async () => {
    if (user && typeof data.id === "string") {
      const requestRes = await sendContactRequest({
        owner_id: user.id,
        recipient_id: data.id,
      });

      // Reload data
      reloadData();
      if (requestRes.error) console.log(requestRes.error);
    } else
      setNotification({
        title: "Not signed in",
        description: "You need to create an account in order to add contacts.",
        type: "info",
        buttonText: "Ok",
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <ContactCard
          style={{ margin: "10vh 35px 70px 35px" }}
          backHref="/"
          contact={savedData}
          onSave={handleSave}
          onDelete={handleDelete}
          onRequest={handleRequest}
          self={user?.id === data.id}
          user={user}
          doneSaving={doneSaving}
        />
      </main>
    </div>
  );
}

export async function getServerSideProps({ req, query }: any) {
  // Get requesting user
  const { user } = await supabase.auth.api.getUserByCookie(req);

  // Choose which profile to look up -> will lookup user if no query parameters are passed
  const uid = query?.u || user?.id || null;

  // User not logged in and no query parameter provided
  if (uid === null) {
    console.log("Not authenticated.");
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  // Check data
  const { data, error } = await getContact(uid);
  console.log(error);

  if (data) {
    console.log("Ready. Sending to profile.");
    return {
      props: { data: data, user: user },
    };
  } else {
    console.log("Missing data. Sending to setup.");
    return {
      redirect: { destination: "/setup", permanent: false },
    };
  }
}

export type SingleLineData = {
  id?: number | string | null;
  label: string;
  value: string;
  access: "public" | "contacts" | "friends";
  owner_id: string | null;
};
export type AddressData = {
  id: number | string | null;
  label: string;
  access: "public" | "contacts" | "friends";
  street: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  owner_id: string | null;
};
export type RequestData = {
  id: number | string | null;
  owner_id: string;
  recipient_id: string;
};
export type ConnectionData = {
  id: number | string | null;
  owner_id: string;
  recipient_id: string;
  access: "public" | "contacts" | "friends";
};
export type ContactType = {
  id?: string;
  name: string;
  surname: string;
  img_src: string;
  phone: SingleLineData[];
  email: SingleLineData[];
  web: SingleLineData[];
  address: AddressData[];
  connection: ConnectionData[];
  request: RequestData[];
};
