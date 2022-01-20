import { Contact } from "../../sdk/contacts";
import styles from "./contactSearchElement.module.css";
import Image from "next/image";
export const ContactSearchElement = ({ contact }: { contact: any }) => {
  return (
    <div tabIndex={0} className={styles.container}>
      <div className={styles.imgContainer}>
        <Image src={contact.img_src} width={50} height={50} objectFit="cover" />
      </div>
      <h3 className={styles.name}>{contact.name + " " + contact.surname}</h3>
    </div>
  );
};
