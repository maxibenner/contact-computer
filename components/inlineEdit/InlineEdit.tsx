import React, { ChangeEvent, useState } from "react";
import { Button } from "../button/Button";
import styles from "./InlineEdit.module.css";

export const InlineEdit = ({
  iconStart,
  iconEnd,
  value,
  onChange,
  onSave,
  style,
}: {
  iconStart: any;
  iconEnd: any;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSave: (value: string) => void;
  style?: React.CSSProperties;
}) => {
  const [editing, setEditing] = useState(false);
  const handleEditingToggle = () => {
    setEditing((prev) => !prev);

    if (editing) {
      // Save
    } else {
      //Make editable
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <input
        style={style}
        className={editing ? styles.containerActive : styles.containerInactive}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
      />
      <Button
        onClick={handleEditingToggle}
        icon={editing ? iconEnd : iconStart}
        style={{ background: "#999", marginLeft: "5px" }}
      />
    </div>
  );
};
