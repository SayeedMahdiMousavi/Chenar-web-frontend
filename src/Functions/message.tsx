import { message } from "antd";
import React from "react";
import { ActionMessage } from "../pages/SelfComponents/TranslateComponents/ActionMessage";

export function addMessage(name: string | number) {
  message.success(<ActionMessage name={name} message="Message.Add" />);
}
export function updateMessage(name: string | number) {
  message.success(<ActionMessage name={name} message="Message.Update" />);
}
