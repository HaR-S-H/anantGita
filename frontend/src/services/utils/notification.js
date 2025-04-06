// utils/notifications.js
import { notification } from 'antd';
// import '@ant-design/v5-patch-for-react-19';
// Configure default settings
notification.config({
  placement: 'bottomRight',
  duration: 4,
});

export const toast = {
  success: (message) => {
    notification.success({
      message,
    });
  },
  error: (message) => {
    notification.error({
      message,
    });
  },
  warning: (message) => {
    notification.warning({
      message,
    });
  },
  info: (message) => {
    notification.info({
      message
    });
  },
};