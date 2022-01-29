import { AuthContext } from "../../context/AuthContext";
import { ProfileContext } from "../../context/ProfileContext";
import { useContext } from "react";
import { db_sendContactRequest } from "../../sdk/db";
import styles from "./_dev_tools_.module.css";
import { supabase } from "../../sdk/supabase";

export const _dev_tools_ = () => {
  const user = useContext(AuthContext);
  const { profile } = useContext(ProfileContext);

  const handleSendRequest = async (event: any) => {
    event.preventDefault();
    if (user && event.target.recipient_id.value) {
      const { data, error } = await db_sendContactRequest(
        user?.id,
        event.target.recipient_id.value
      );
      if (error) console.log(error);
      else console.log("Sucessfully sent request.");
    } else console.log("User object or recipient_id missing.");
  };

  const handleAddContact = async (event: any) => {
    event.preventDefault();
    if (user && event.target.recipient_id.value) {
      // Add connection
      const { data, error } = await supabase.from("connection").insert({
        owner_id: event.target.recipient_id.value,
        contact_id: user.id,
        is_private: true,
      });

      if (error) console.log(error);
      else console.log("Sucessfully added contact.");
    } else console.log("User object or recipient_id missing.");
  };

  return (
    <div className={styles.container}>
      <h3>Dev Tools</h3>
      <div className={styles.actionContainer}>
        <button onClick={() => console.log(user)}>Log user</button>
      </div>
      <div className={styles.actionContainer}>
        <button onClick={() => console.log(profile)}>Log Profile</button>
      </div>
      <form className={styles.actionContainer} onSubmit={handleSendRequest}>
        <input name="recipient_id" placeholder="Recipient id" />
        <button type="submit">Send request</button>
      </form>
      <form className={styles.actionContainer} onSubmit={handleAddContact}>
        <input name="recipient_id" placeholder="Contact id" />
        <button type="submit">Add contact</button>
      </form>
    </div>
  );
};
