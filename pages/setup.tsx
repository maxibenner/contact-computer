import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { InitialSetupCard } from "../components/initialSetupCard/InitialSetupCard";
import { supabase } from "../sdk/supabase";
import styles from "../styles/Home.module.css";
import { NotificationContext } from "../context/NotificationContext";
import Router from "next/router";
import { AuthContext } from "../context/AuthContext";

/**
 * A form to submit the initial user information
 * @returns JSX Element
 */
export default function Setup() {
  const [notification, setNotification] = useContext(NotificationContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useContext(AuthContext);

  // Introduction
  useEffect(() => {
    setNotification({
      title: "Before you get started",
      description:
        "Add your name and photo so others can find you. Make sure to check for spelling mistakes as you won't be able to change the name later.",
      type: "info",
      buttonText: "Got it",
    });
  }, []);

  // Reroute
  useEffect(() => {
    if (user === null) Router.push("/signin");
  }, []);

  // Validate and submit data
  const handleSubmit = async ({
    name,
    surname,
    image,
  }: {
    name: string;
    surname: string;
    image: File | null;
  }) => {
    // Check if information is complete
    if (name && surname && image) {
      // Set loading state
      setIsSubmitting(true);

      // Upload image
      const imageRes = await supabase.storage
        .from("public")
        .upload(`${user.id}/profile_image`, image);

      if (imageRes.error) {
        console.log(imageRes.error);

        // Set loading state
        setIsSubmitting(false);

        // Show error
        return setNotification({
          title: "Error",
          description:
            "I wasn't able to upload your photo. Please reload this page and try again.",
          type: "error",
          buttonText: "Ok",
        });
      }

      // Upload name
      const projectId = "oedndnouvlbxuwkvdynh";
      const userId = user.id;
      const nameRes = await supabase.from("profile").insert({
        id: user.id,
        name: name,
        surname: surname,
        img_src: `https://${projectId}.supabase.in/storage/v1/object/public/public/${userId}/profile_image`,
      });

      // Error uploading name
      if (nameRes.error) {
        console.log(nameRes.error);

        // Set loading state
        setIsSubmitting(false);

        const deleteRes = await supabase.storage
          .from("public")
          .remove([`${user.id}/profile_image`]);

        // Show error
        return setNotification({
          title: "Error",
          description:
            "I wasn't able to upload your name. Please reload this page and try again.",
          type: "error",
          buttonText: "Ok",
        });
      }

      // Send to profile on success
      Router.push("/contact");
    } else {
      // Missing information

      // Set loading state
      setIsSubmitting(false);

      // Error promt
      setNotification({
        title: "Missing information",
        description:
          "Make sure to add a photo, your first name, and your last name. This is the basic information people will need to find you.",
        type: "error",
        buttonText: "Ok",
      });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <InitialSetupCard
          style={{ margin: "10vh 35px 70px 35px" }}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </main>
    </div>
  );
}

// export async function getServerSideProps({ req }: any) {
//   const { user, error } = await supabase.auth.api.getUserByCookie(req);

//   // if (!user) {
//   //   // If no user, redirect to index.
//   //   return {
//   //     props: {},
//   //     redirect: { destination: "/signin", permanent: false },
//   //   };
//   // }

//   // If user, return
//   return { props: { user } };
// }
