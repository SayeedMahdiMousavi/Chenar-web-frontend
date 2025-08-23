import { message } from 'antd';

export default function manageErrors(error: any) {
  if (Object.keys(error?.response?.data || {})?.length) {
    const messageText =
      error?.response?.data[Object.keys(error?.response?.data)[0]];
    if (
      typeof messageText?.[0] === 'string' ||
      typeof messageText?.[0] === 'number'
    ) {
      message.error(messageText?.[0]);
    } else {
      if (
        typeof messageText?.message?.[0] === 'string' ||
        typeof messageText?.message?.[0] === 'number'
      ) {
        message.error(messageText?.message?.[0]);
      }
    }
    if (Object.keys(error?.response?.data || {}).length) {
      const messageText =
        error?.response?.data[Object.keys(error?.response?.data)[0]]?.[0];
      message.error(messageText);
    }
  }
}
