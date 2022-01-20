import { ReactNode, useEffect, useState } from "react";
import {
  MdOutlineFavorite,
  MdPublic,
  MdWork,
  MdEdit,
  MdSave,
  MdDelete,
  MdAdd,
} from "react-icons/md";
import { AddressData } from "../../pages/contact";
import { Button } from "../button/Button";
import { InputTextBasic } from "../inputTextBasic/InputTextBasic";
import styles from "./addressField.module.css";
import { Dropdown } from "../dropdown/Dropdown";
import { Spinner } from "../spinner/Spinner";

export const AddressField = ({
  data: {
    id,
    label,
    access,
    street,
    city,
    state,
    postal,
    country,
    startEditing,
    owner_id,
  },
  onSave,
  onCancel,
  onDelete,
  editable,
  loadingEndToggle,
  self,
}: {
  data: AddressData & { startEditing?: boolean };
  onSave: ({
    id,
    label,
    street,
    city,
    postal,
    state,
    country,
    access,
  }: {
    id: number | string | null;
    label: string;
    street: string;
    city: string;
    postal: string;
    state: string;
    country: string;
    access: "public" | "contacts" | "friends";
    owner_id: string | null;
  }) => void;
  onCancel: ({
    id,
    type,
  }: {
    id: number | string | null;
    type: "phone" | "email" | "web" | "address";
  }) => void;
  onDelete: ({
    id,
    label,
    street,
    city,
    postal,
    state,
    country,
    access,
  }: {
    id: number | string | null;
    label: string;
    street: string;
    city: string;
    postal: string;
    state: string;
    country: string;
    access: "public" | "contacts" | "friends";
    owner_id: string | null;
  }) => void;
  editable: boolean;
  loadingEndToggle?: boolean;
  self: boolean;
}) => {
  // Track state of element writing || viewing
  const [editing, setEditing] = useState(false);

  // Keep track of which icon to use for the privacy button
  const [icon, setIcon] = useState<ReactNode>();

  // Check changes to prevent saving with old data
  const [hasChanged, setHasChanged] = useState(false);

  // Enables closing of dropdown from parent component
  const [accessOutsideToggle, setAccessOutsideToggle] = useState(false);

  // Submit spinner
  const [loading, setLoading] = useState(false);

  // Delete spinner
  const [deleteLoading, setDeleteLoading] = useState(false);
  useEffect(() => {
    setLoading(false);
    setEditing(false);
    setDeleteLoading(false);
  }, [loadingEndToggle]);

  // Track data
  const [newLabel, setNewLabel] = useState(label);
  const [newStreet, setNewStreet] = useState(street);
  const [newCity, setNewCity] = useState(city);
  const [newPostal, setNewPostal] = useState(postal);
  const [newState, setNewState] = useState(state);
  const [newCountry, setNewCountry] = useState(country);
  const [newAccess, setNewAccess] = useState<"public" | "contacts" | "friends">(
    access
  );

  // Adjust icon and make sure that new elements start in write mode
  useEffect(() => {
    if (newAccess === "public") setIcon(<MdPublic />);
    if (newAccess === "contacts") setIcon(<MdWork />);
    if (newAccess === "friends") setIcon(<MdOutlineFavorite />);

    // Make sure that new ones are write initially
    if (startEditing) setEditing(true);
  }, [access, newAccess]);

  // Submit data to parent
  const handleSave = () => {
    onSave({
      id: id,
      label: newLabel,
      street: newStreet,
      city: newCity,
      postal: newPostal,
      state: newState,
      country: newCountry,
      access: newAccess,
      owner_id: owner_id || null,
    });
    setLoading(true);
    setHasChanged(false);
  };

  // Submit deletion data to parent
  const handleDelete = () => {
    onDelete({
      id: id,
      label: newLabel,
      street: newStreet,
      city: newCity,
      postal: newPostal,
      state: newState,
      country: newCountry,
      access: newAccess,
      owner_id: owner_id || null,
    });
    setDeleteLoading(true);
    setHasChanged(false);
  };

  // Cancel editing or remove new, unsaved element
  const handleCancel = () => {
    // Only remove element if new -> otherwise just switch to view mode
    if (typeof id === "string") {
      if (id.includes("local")) onCancel({ id: id, type: "address" });
    } else {
      setEditing(false);
    }
  };

  // Handle input changes
  useEffect(() => {
    if (
      label === newLabel &&
      street === newStreet &&
      city === newCity &&
      postal === newPostal &&
      state === newState &&
      country === newCountry &&
      access === newAccess
    ) {
      setHasChanged(false);
    } else setHasChanged(true);
  }, [
    newLabel,
    newStreet,
    newCity,
    newPostal,
    newState,
    newCountry,
    newAccess,
  ]);
  useEffect(() => {
    setAccessOutsideToggle((prev) => !prev);
  }, [newAccess]);

  return editing ? (
    /* Writing */
    <div className={styles.container_editing}>
      <div className={styles.textContainer}>
        <InputTextBasic
          autoFocus={startEditing}
          placeholder='Label, e.g. "Home"'
          style={{ marginBottom: "6px" }}
          value={newLabel}
          onChange={setNewLabel}
        />
        <InputTextBasic
          placeholder="Street"
          style={{ marginBottom: "6px" }}
          value={newStreet}
          onChange={setNewStreet}
        />
        <InputTextBasic
          placeholder="City"
          style={{ marginBottom: "6px" }}
          value={newCity}
          onChange={setNewCity}
        />
        <InputTextBasic
          placeholder="State"
          style={{ marginBottom: "6px" }}
          value={newState}
          onChange={setNewState}
        />
        <InputTextBasic
          placeholder="Postal"
          style={{ marginBottom: "6px" }}
          value={newPostal}
          onChange={setNewPostal}
        />
        <InputTextBasic
          placeholder="Country"
          style={{ marginBottom: "6px" }}
          value={newCountry}
          onChange={setNewCountry}
        />
      </div>
      <div className={styles.buttonGrid}>
        <Dropdown
          icon={icon}
          position="left"
          noVisualChange
          outsideToggle={accessOutsideToggle}
        >
          {newAccess !== "public" && (
            <Button
              onClick={() => setNewAccess("public")}
              icon={<MdPublic />}
            />
          )}
          {newAccess !== "contacts" && (
            <Button
              onClick={() => setNewAccess("contacts")}
              icon={<MdWork />}
            />
          )}
          {newAccess !== "friends" && (
            <Button
              onClick={() => setNewAccess("friends")}
              icon={<MdOutlineFavorite />}
            />
          )}
        </Dropdown>
        <Button
          onClick={hasChanged ? handleSave : handleCancel}
          icon={
            loading ? <Spinner small /> : hasChanged ? <MdSave /> : <MdAdd />
          }
          backgroundColor={
            loading
              ? "var(--color-main)"
              : hasChanged
              ? "var(--color-main)"
              : "var(--color-grey)"
          }
          iconStyle={{
            fontSize: hasChanged ? "unset" : "3rem",
            transform: loading
              ? "rotate(0deg)"
              : hasChanged
              ? "rotate(0deg)"
              : "rotate(-45deg)",
          }}
        />
        <Button
          onClick={handleDelete}
          icon={deleteLoading ? <Spinner small /> : <MdDelete />}
          backgroundColor={"var(--color-error)"}
        />
      </div>
    </div>
  ) : (
    /* Reading */
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p className={styles.label}>{newLabel}</p>
        <p className={styles.value}>{newStreet}</p>
        <p className={styles.value}>{`${newCity} ${newState} ${newPostal}`}</p>
        <p className={styles.value}>{newCountry}</p>
      </div>
      {self && (
        <div
          className={styles.accessIcon}
          style={{ marginRight: editable ? "4px" : 0 }}
        >
          {icon}
        </div>
      )}
      {editable && (
        <Button
          onClick={() => setEditing(true)}
          icon={<MdEdit />}
          backgroundColor="var(--color-grey)"
        />
      )}
    </div>
  );
};
