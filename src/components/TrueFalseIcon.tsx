import React from "react";
import { TickIcon } from "../icons";
import { IoClose as CloseIcon } from "react-icons/io5";

export default function TrueFalseTableColumn({ value }: { value: boolean }) {
  return !value ? (
    <CloseIcon style={styles.icon} />
  ) : (
    <TickIcon style={styles.icon} />
  );
}

const styles = {
  icon: { fontSize: "22px" },
};
