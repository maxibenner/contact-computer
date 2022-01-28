import Image from "next/image";
import { TransformedConnectionType } from "../../sdk/db";
import styles from "./contactListElement.module.css";

export const ContactListElement = ({
  contact,
  onClick,
}: {
  contact: TransformedConnectionType;
  onClick?: () => void;
}) => {
  return (
    <div tabIndex={0} className={styles.container}>
      <div className={styles.contentContainer} onClick={onClick}>
        <div className={styles.imgContainer}>
          <Image
            src={contact.data.img_src}
            width={50}
            height={50}
            objectFit="cover"
          />
        </div>
        <h3 className={styles.name}>
          {contact.data.name + " " + contact.data.surname}
        </h3>
      </div>
    </div>
  );
};
