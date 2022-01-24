import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { InitialSetupCard } from "../components/initialSetupCard/InitialSetupCard";
import { supabase } from "../sdk/supabase";
import styles from "../styles/Home.module.css";
import { NotificationContext } from "../context/NotificationContext";
import Router, { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import { ProfileContext } from "../context/ProfileContext";

/**
 * A form to submit the initial user information
 * @returns JSX Element
 */
export default function Setup() {
  const [notification, setNotification] = useContext(NotificationContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useContext(AuthContext);
  const { reloadData } = useContext(ProfileContext);

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
    // Make sure user is logged in

    if (!user)
      return setNotification({
        title: "Error",
        description:
          "It looks like you are not logged in. Please sign in and try again.",
        type: "error",
        buttonText: "Ok",
      });

    // Check if information is complete
    if (name && surname && image && user) {
      // Set loading state
      setIsSubmitting(true);

      // Upload image
      const imageRes = (await supabase.storage
        .from("public")
        .upload(`${user.id}/profile_image`, image)) as {
        data: {
          Key: string;
        } | null;
        error: (Error & { statusCode: string }) | null;
      };

      if (imageRes.error && imageRes.error.statusCode !== "23505") {
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

      if (imageRes.error && imageRes.error.statusCode !== "23505") {
        // Update image
        const imageRes = await supabase.storage
          .from("public")
          .update(`${user.id}/profile_image`, image);
      }

      // Submit name
      const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
      const userId = user.id;
      const nameRes = await supabase.from("profile").insert({
        id: user.id,
        name: name,
        surname: surname,
        img_src: `https://${projectId}.supabase.in/storage/v1/object/public/public/${userId}/profile_image`,
      });

      // Reload context
      await reloadData();

      // Error uploading name
      if (nameRes.error) {
        // Set loading state
        setIsSubmitting(false);

        const deleteRes = await supabase.storage
          .from("public")
          .remove([`${user.id}/profile_image`]);

        // Show error
        return setNotification({
          title: "Error",
          description:
            "I wasn't able to submit your name. Please reload this page and try again.",
          type: "error",
          buttonText: "Ok",
        });
      }

      // Send to profile on success
      Router.push("/profile");
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
