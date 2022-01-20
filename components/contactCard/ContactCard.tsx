import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useEffect, useState, useContext } from "react";
import { MdAdd, MdArrowBack, MdGroupAdd, MdOutlineClose } from "react-icons/md";
import { AddressData, ContactType, SingleLineData } from "../../pages/contact";
import { AddressField } from "../addressField/AddressField";
import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { Dropdown } from "../dropdown/Dropdown";
import { SingleLineField } from "../singleLineField/SingleLineField";
import styles from "./contactCard.module.css";
import { NotificationContext } from "../../context/NotificationContext";
import { sendContactRequest } from "../../sdk/db";

export const ContactCard = ({
  contact,
  style,
  backHref,
  onSave,
  onDelete,
  onRequest,
  self,
  doneSaving,
  user,
}: {
  contact: ContactType;
  style?: CSSProperties;
  backHref: string;
  onSave: ({
    data,
    type,
  }: {
    data: SingleLineData | AddressData;
    type: "phone" | "email" | "web" | "address";
  }) => void;
  onDelete: ({
    data,
    type,
  }: {
    data: SingleLineData | AddressData;
    type: "phone" | "email" | "web" | "address";
  }) => void;
  onRequest: () => void;
  self: boolean;
  doneSaving?: boolean;
  user: User | null;
}) => {
  // Toggle add dropdown
  const [dropdownToggle, setDropdownToggle] = useState(false);

  // Notifications
  const [notification, setNotification] = useContext(NotificationContext);

  // Local copy of contact data and keep updated
  const [localContact, setLocalContact] = useState<ContactType>(contact);
  useEffect(() => setLocalContact(contact), [contact]);

  // Track if a field is currently being edited
  const [activeEdit, setActiveEdit] = useState(false);

  // Pulse fields to end loading
  const [fieldLoadingPulse, setFieldLoadingPulse] = useState(false);

  // Contact request loading
  const [contactRequestLoading, setContactRequestLoading] = useState(false);

  // ReEnable adding
  useEffect(() => {
    setActiveEdit(false);
    setFieldLoadingPulse((prev) => !prev);
    setContactRequestLoading(false);
  }, [doneSaving]);

  // Add new field to local data copy
  const handleAddData = (type: "phone" | "email" | "web" | "address") => {
    // Set to active editing
    setActiveEdit(true);

    // Create copy of data
    const contactCopy = { ...localContact };

    // Create arbitrary id to facilitate cancel operation
    const randomId = (Math.random() * 99999999).toFixed(0) + "_local";
    console.log(randomId);

    // Push cappropriate data
    if (type === "address") {
      contactCopy.address.push({
        id: randomId,
        label: "",
        access: "public",
        street: "",
        city: "",
        state: "",
        postal: "",
        country: "",
        startEditing: true,
        owner_id: null,
      } as AddressData & { startEditing: boolean });
    } else
      contactCopy[type].push({
        id: randomId,
        label: "",
        value: "",
        access: "public",
        startEditing: true,
        owner_id: null,
      } as SingleLineData & { startEditing: boolean });

    // Close add field dropdown
    setDropdownToggle((prev) => !prev);

    // Update local data copy
    setLocalContact(contactCopy);
  };

  // LOCAL: Remove unsaved data from local copy
  const handleCancel = ({
    id,
    type,
  }: {
    id: number | string | null;
    type: "phone" | "email" | "web" | "address";
  }) => {
    if (!id) return console.log("There was a problem. Id is null.");

    const tmpContact = { ...localContact };

    // Get array of corresponding type
    const typeArray = tmpContact[type] as any[];

    // Remove passed field
    tmpContact[type] = typeArray.filter((e) => e.id !== id);

    // LOCAL: Update fields
    setLocalContact(tmpContact);

    // End active editing status
    setActiveEdit(false);
  };

  const handleRequest = () => {
    setContactRequestLoading(true);
    onRequest();
  };

  return (
    <Card style={style}>
      {/* Main */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", marginBottom: "25px" }}>
          <div className={styles.imageContainer}>
            <Image objectFit="cover" layout="fill" src={localContact.img_src} />
          </div>
          <h1
            style={{ fontSize: "2.8rem", margin: 0 }}
          >{`${localContact.name} ${localContact.surname}`}</h1>
        </div>
        {/* Data */}
        <div>
          {localContact.email.length > 0 && (
            <>
              <h1 style={{ margin: "20px 0 8px 0" }}>Email</h1>
              {localContact.email.map((email) => (
                <SingleLineField
                  key={email.value}
                  type="email"
                  data={email}
                  onSave={(data) => onSave({ data: data, type: "email" })}
                  onCancel={handleCancel}
                  onDelete={(data) => onDelete({ data: data, type: "email" })}
                  editable={self}
                  loadingEndToggle={fieldLoadingPulse}
                  self={self}
                />
              ))}
            </>
          )}
          {localContact.phone.length > 0 && (
            <>
              <h1 style={{ margin: "40px 0 8px 0" }}>Phone</h1>
              {localContact.phone.map((phone) => (
                <SingleLineField
                  key={phone.value}
                  type="phone"
                  data={phone}
                  onSave={(data) => onSave({ data: data, type: "phone" })}
                  onCancel={handleCancel}
                  onDelete={(data) => onDelete({ data: data, type: "phone" })}
                  editable={self}
                  loadingEndToggle={fieldLoadingPulse}
                  self={self}
                />
              ))}
            </>
          )}
          {localContact.web.length > 0 && (
            <>
              <h1 style={{ margin: "40px 0 8px 0" }}>Web</h1>
              {localContact.web.map((web) => (
                <SingleLineField
                  key={web.value}
                  type="web"
                  data={web}
                  onSave={(data) => onSave({ data: data, type: "web" })}
                  onCancel={handleCancel}
                  onDelete={(data) => onDelete({ data: data, type: "web" })}
                  editable={self}
                  loadingEndToggle={fieldLoadingPulse}
                  self={self}
                />
              ))}
            </>
          )}
          {localContact.address.length > 0 && (
            <>
              <h1 style={{ margin: "40px 0 8px 0" }}>Address</h1>
              {localContact.address.map((address) => (
                <AddressField
                  key={address.street}
                  data={address}
                  onSave={(data) => onSave({ data: data, type: "address" })}
                  onCancel={handleCancel}
                  onDelete={(data) => onDelete({ data: data, type: "address" })}
                  editable={self}
                  loadingEndToggle={fieldLoadingPulse}
                  self={self}
                />
              ))}
            </>
          )}
        </div>
        {self ? (
          <Dropdown
            outsideToggle={dropdownToggle}
            inactive={activeEdit}
            icon={<MdAdd />}
            iconActive={<MdOutlineClose />}
            style={{ position: "absolute", top: -20, left: -20 }}
          >
            <Button
              onClick={() => handleAddData("phone")}
              innerStyle={{ padding: "0 15px" }}
              text="Phone"
            />
            <Button
              onClick={() => handleAddData("email")}
              innerStyle={{ padding: "0 15px" }}
              text="Email"
            />
            <Button
              onClick={() => handleAddData("web")}
              innerStyle={{ padding: "0 15px" }}
              text="Web"
            />
            <Button
              onClick={() => handleAddData("address")}
              innerStyle={{ padding: "0 15px" }}
              text="Address"
            />
          </Dropdown>
        ) : (
          <>
            <Link href={backHref}>
              <a>
                <Button
                  icon={<MdArrowBack />}
                  style={{ position: "absolute", top: -20, left: -20 }}
                />
              </a>
            </Link>
            {!self && (
              <Button
                onClick={contact.request[0] ? undefined : handleRequest}
                inactive={contact.request[0] ? true : false}
                text={contact.request[0] ? "Request pending" : "Add contact"}
                iconStyle={{ fontSize: "2.6rem" }}
                style={{ marginTop: "25px" }}
                icon={contact.request[0] ? undefined : <MdGroupAdd />}
                loading={contactRequestLoading}
                backgroundColor={
                  contact.request[0] ? "var(--color-grey)" : "var(--color-main)"
                }
              />
            )}
          </>
        )}
      </div>
    </Card>
  );
};
