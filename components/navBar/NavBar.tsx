import styles from "./navBar.module.css";
import { Logo } from "../logo/Logo";
import { SpeechBubble } from "../speechBubble/SpeechBubble";
import { NotificationContext } from "../../context/NotificationContext";
import { useContext } from "react";
import Link from "next/link";
import { Button } from "../button/Button";
import { AuthContext } from "../../context/AuthContext";
import { signOut } from "../../sdk/auth";
import { ProfileContext } from "../../context/ProfileContext";

export const NavBar = () => {
  const [notification, setNotification] = useContext(NotificationContext);
  const profile = useContext(ProfileContext);
  const user = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <Link href="/">
        <a>
          <Logo />
        </a>
      </Link>
      <div className={styles.navMenu}>
        {user ? (
          <>
            <Link href="/">
              <p>Search</p>
            </Link>
            <Link href="/contacts">
              <div className={styles.itemWithBadge}>
                <p>Contacts</p>
                {profile && <div>{profile?.request.length}</div>}
              </div>
            </Link>
            <Link href="/contact">
              <p>Profile</p>
            </Link>
            <Button
              tabindex={0}
              onClick={signOut}
              style={{ height: "50px" }}
              innerStyle={{ padding: "0 25px" }}
              text="Logout"
            />
          </>
        ) : (
          <>
            <Link href="/signin">
              <p>Sign In</p>
            </Link>
            <Link href="/signup">
              <a>
                <Button
                  tabindex={0}
                  style={{ height: "50px" }}
                  innerStyle={{ padding: "0 25px" }}
                  text="Create Account"
                />
              </a>
            </Link>
          </>
        )}
      </div>

      {notification && (
        <SpeechBubble
          title={notification.title}
          description={notification.description}
          type={notification.type}
          buttonText={notification.buttonText || undefined}
          onClick={() => setNotification(null)}
        />
      )}
    </div>
  );
};
