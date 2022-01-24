import { ReactNode, useEffect, useState, useContext } from "react";
import {
  MdOutlineFavorite,
  MdPublic,
  MdWork,
  MdSave,
  MdEdit,
  MdAdd,
  MdDelete,
} from "react-icons/md";
import { Button } from "../button/Button";
import { InputTextBasic } from "../inputTextBasic/InputTextBasic";
import styles from "./singleLineField.module.css";
import { SingleLineData } from "../../sdk/db";
import { Dropdown } from "../dropdown/Dropdown";
import { Spinner } from "../spinner/Spinner";
import { ProfileContext } from "../../context/ProfileContext";

/**
 * An element displaying user data
 * @param label The name of the data point
 * @param value The data
 * @param access The access level of the data
 * @param editing Switches between static and editor display mode
 * @param startEditing Pass true to start in editing mode
 */
export const SingleLineField = ({
  data: { id, owner_id, label, value, access, startEditing },
  onCancel,
  onSubmitEnd,
  editable,
  type,
  self,
}: {
  data: SingleLineData & { startEditing?: boolean };
  onCancel: ({
    id,
    type,
  }: {
    id: number | string | null;
    type: "phone" | "email" | "web" | "address";
  }) => void;
  onSubmitEnd: () => void;
  editable?: boolean;
  type: "phone" | "email" | "web";
  self: boolean;
}) => {
  const { saveContactInfo, deleteContactInfo } = useContext(ProfileContext);

  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [deletionLoading, setDeletionLoading] = useState(false);

  const [editing, setEditing] = useState(false);

  const [icon, setIcon] = useState<ReactNode>();

  const [hasChanged, setHasChanged] = useState(false);

  const [accessOutsideToggle, setAccessOutsideToggle] = useState(false);

  const [placeholder, setPlaceholder] = useState<string>();

  const [newLabel, setNewLabel] = useState<string>(label);
  const [newValue, setNewValue] = useState<string>(value);
  const [newAccess, setNewAccess] = useState<"public" | "contacts" | "friends">(
    access
  );

  // Load and reload values
  useEffect(() => {
    setNewValue(value);
    setNewLabel(label);
  }, [label, value]);

  // Change icons
  useEffect(() => {
    if (newAccess === "public") setIcon(<MdPublic />);
    if (newAccess === "contacts") setIcon(<MdWork />);
    if (newAccess === "friends") setIcon(<MdOutlineFavorite />);

    if (type === "phone") setPlaceholder("Phone number");
    if (type === "web") setPlaceholder("URL or social tag");
    if (type === "email") setPlaceholder("Email address");

    // Make sure that new ones are write initially
    if (startEditing) setEditing(true);
  }, [access, newAccess]);

  // Submit data
  const handleSave = async () => {
    setSubmissionLoading(true);
    await saveContactInfo(
      {
        id: id,
        label: newLabel,
        value: newValue,
        access: newAccess,
        owner_id: owner_id,
      },
      type
    );
    setEditing(false);
    setSubmissionLoading(false);
    setHasChanged(false);
    onSubmitEnd();
  };

  // Submit delete data to parent
  const handlDelete = async () => {
    setDeletionLoading(true);
    if (typeof id === "number") {
      await deleteContactInfo(id, type);
    }
    setHasChanged(false);
  };

  // Cancel editing or remove new, unsaved element
  const handleCancel = () => {
    // Only remove element if new -> otherwise just switch to view mode
    if (typeof id === "string") {
      if (id.includes("local")) onCancel({ id, type });
    } else {
      setEditing(false);
    }
  };

  // Handle input changes
  const handleLabelChange = (v: string) => {
    setNewLabel(v);
    if (label === v && value === newValue && access === newAccess) {
      setHasChanged(false);
    } else setHasChanged(true);
  };
  const handleValueChange = (v: string) => {
    setNewValue(v);
    if (value === v && label === newLabel && access === newAccess) {
      setHasChanged(false);
    } else setHasChanged(true);
  };
  // Handle access change
  const handleAccessChange = (v: "public" | "friends" | "contacts") => {
    setNewAccess(v);

    // Check has changed
    if (value === newValue && label === newLabel && access === v) {
      setHasChanged(false);
    } else setHasChanged(true);

    // Close menu
    if (access === newAccess) setAccessOutsideToggle((prev) => !prev);
  };

  return editing ? (
    /* Writing */
    <div className={styles.container_editing}>
      <div className={styles.textContainer}>
        <InputTextBasic
          autoFocus={startEditing}
          placeholder='Label, e.g. "Personal"'
          style={{ marginBottom: "6px" }}
          value={newLabel}
          onChange={handleLabelChange}
        />
        <InputTextBasic
          placeholder={placeholder}
          value={newValue}
          onChange={handleValueChange}
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
              onClick={() => handleAccessChange("public")}
              icon={<MdPublic />}
            />
          )}
          {newAccess !== "contacts" && (
            <Button
              onClick={() => handleAccessChange("contacts")}
              icon={<MdWork />}
            />
          )}
          {newAccess !== "friends" && (
            <Button
              onClick={() => handleAccessChange("friends")}
              icon={<MdOutlineFavorite />}
            />
          )}
        </Dropdown>
        <Button
          onClick={hasChanged ? handleSave : handleCancel}
          icon={
            submissionLoading ? (
              <Spinner small />
            ) : hasChanged ? (
              <MdSave />
            ) : (
              <MdAdd />
            )
          }
          backgroundColor={
            submissionLoading
              ? "var(--color-main)"
              : hasChanged
              ? "var(--color-main)"
              : "var(--color-grey)"
          }
          iconStyle={{
            fontSize: hasChanged ? "unset" : "3rem",
            transform: submissionLoading
              ? "rotate(0deg)"
              : hasChanged
              ? "rotate(0deg)"
              : "rotate(-45deg)",
          }}
        />
        {typeof id !== "string" && (
          <Button
            onClick={handlDelete}
            icon={deletionLoading ? <Spinner small /> : <MdDelete />}
            backgroundColor={"var(--color-error)"}
          />
        )}
      </div>
    </div>
  ) : (
    /* Reading */
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p className={styles.label}>{newLabel}</p>
        <p className={styles.value}>{newValue}</p>
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
