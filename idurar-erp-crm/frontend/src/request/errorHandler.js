import { notification } from 'antd';
import codeMessage from './codeMessage';

const errorHandler = (error) => {
  if (!navigator.onLine) {
    notification.config({
      duration: 15,
      maxCount: 1,
    });
    // Code to execute when there is internet connection
    notification.error({
      message: 'No internet connection',
      description: 'Cannot connect to the Internet, Check your internet network',
    });
    return {
      success: false,
      result: null,
      message: 'Cannot connect to the server, Check your internet network',
    };
  }

  const { response } = error;

  if (!response) {
    notification.config({
      duration: 20,
      maxCount: 1,
    });
    // Code to execute when there is no internet connection
    // notification.error({
    //   message: 'Problem connecting to server',
    //   description: 'Cannot connect to the server, Try again later',
    // });
    return {
      success: false,
      result: null,
      message: 'Cannot connect to the server, Contact your Account administrator',
    };
  }

  const isLogoutApi = error.config && error.config.url && error.config.url.includes('/logout');

  if (response && response.data && response.data.jwtExpired) {
    const result = window.localStorage.getItem('auth');
    const jsonFile = window.localStorage.getItem('isLogout');
    const { isLogout } = (jsonFile && JSON.parse(jsonFile)) || false;
    window.localStorage.removeItem('auth');
    window.localStorage.removeItem('isLogout');
    if ((result || isLogout) && !isLogoutApi) {
      window.dispatchEvent(new Event('auth-expire'));
    }
  }

  if (response && response.status) {
    const message = response.data && response.data.message;

    const errorText = message || codeMessage[response.status];
    const { status, error } = response;
    notification.config({
      duration: 20,
      maxCount: 2,
    });
    notification.error({
      message: `Request error ${status}`,
      description: errorText,
    });

    if (response?.data?.error?.name === 'JsonWebTokenError') {
      window.localStorage.removeItem('auth');
      window.localStorage.removeItem('isLogout');
      if (!isLogoutApi) {
        window.dispatchEvent(new Event('auth-expire'));
      }
    } else return response.data;
  } else {
    notification.config({
      duration: 15,
      maxCount: 1,
    });

    if (navigator.onLine) {
      // Code to execute when there is internet connection
      notification.error({
        message: 'Problem connecting to server',
        description: 'Server might be unreachable or down. Try again later',
      });
      return {
        success: false,
        result: null,
        message: 'Cannot connect to the server, Server might be unreachable or down',
      };
    } else {
      // Code to execute when there is no internet connection
      notification.error({
        message: 'No internet connection',
        description: 'Cannot connect to the Internet, Check your internet network',
      });
      return {
        success: false,
        result: null,
        message: 'Cannot connect to the server, Check your internet network',
      };
    }
  }
};

export default errorHandler;
