import { App } from 'antd';

let message;
let notification;
let modal;

export default function AntdGlobalContext() {
  const staticApp = App.useApp();
  message = staticApp.message;
  notification = staticApp.notification;
  modal = staticApp.modal;
  return null;
}

export { message, notification, modal };
