import { message } from "antd";

export const manageNetworkError = (error: any) => {
  if (error?.message === "timeout of 5000ms exceeded") {
    message.error("Internet connection is very loose");
  } else if (error?.message === "Network Error") {
    message.error("Network error. please check your internet connection");
  }
  return;
};
