import { Button, ButtonProps } from "antd";
import React from "react";
import { checkPermissions } from "../../Functions";
import { EditIcon } from "../../icons";

export function EditButton({
  model,
  ...rest
}: ButtonProps & { model?: string }) {
  return Boolean(model) && !checkPermissions(`change_${model}`) ? null : (
    <Button
      size="small"
      type="text"
      style={styles.button}
      icon={<EditIcon style={styles.icon} />}
      {...rest}
    />
  );
}

const styles = {
  button: { paddingTop: "2px" },
  icon: { fontSize: "17px" },
};
