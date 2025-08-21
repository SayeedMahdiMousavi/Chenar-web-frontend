import React from "react";
import { Select } from "antd";
import { CenteredSpin } from "../pages/SelfComponents/Spin";

export function SelectLoaderOption({ value, ...rest }: { value: string }) {
  return (
    <Select.Option
      disabled={true}
      key={value}
      value={value}
      label="adfsdfdfd"
      style={styles.option}
    >
      <CenteredSpin size="small" style={{ margin: "0px" }} />
    </Select.Option>
  );
}

const styles = {
  option: { height: "40px" },
};
