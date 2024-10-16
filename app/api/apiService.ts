// 'use client';
// import {
//   getJsonItemFromLocalStorage,
//   notify,
//   removeCookie,
//   saveJsonItemToLocalStorage,
// } from '@/lib/utils';
// import axios, { AxiosError } from 'axios';

// import toast from 'react-hot-toast';
// import { generateRefreshToken } from './controllers/auth';

// export const handleError = (error: any, showError: boolean = true) => {
//   if (showError) {
//     if (!error.response.data.title) {
//       notify({
//         title: 'Error!',
//         text: error.response.data.error.responseDescription,
//         type: 'error',
//       });
//     } else if (error.code === 'ECONNABORTED') {
//       notify({
//         title: 'Network Timeout',
//         text: 'The request took too long. Please try again later.',
//         type: 'error',
//       });
//       return error;
//     } else if (error.code === 'ERR_NETWORK') {
//       notify({
//         title: 'Network Timeout!',
//         text: 'Check your network and try again',
//         type: 'error',
//       });
//       return error;
//     } else {
//       notify({
//         title: 'Error!',
//         text: 'An error occurred, please try again',
//         type: 'error',
//       });
//     }
//   }
// };

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const now = Date.now();
// const TOKEN_REFRESH_WINDOW = 1 * 60 * 1000;

// export const TOKEN_EXPIRY_DURATION = 10 * 60 * 1000;
// export const REFRESH_BEFORE_EXPIRY = 1 * 60 * 1000; // 1 minute before expiry

// const logout = async () => {
//   // const response = await logout();
//   // const isSuccessful = response?.data?.isSuccessful;
//   // if (isSuccessful) {
//   toast.error('Session Expired, please log in again.');
//   window.location.href = '/auth/login';
//   localStorage.clear();
//   removeCookie('token');
//   // }
// };
// export const refreshToken = async () => {
//   const userData = getJsonItemFromLocalStorage('userInformation');
//   if (!userData) return null;

//   const { token, email } = userData;

//   try {
//     const response = await generateRefreshToken({
//       token,
//       email,
//     });

//     const newToken = response?.data?.data?.jwtToken;

//     const newExpiry = Date.now() + TOKEN_EXPIRY_DURATION;
//     saveJsonItemToLocalStorage('userInformation', {
//       ...userData,
//       token: newToken,
//       tokenExpiry: newExpiry,
//     });

//     return newToken;
//   } catch (error) {
//     return null;
//   }
// };

// const timeout = 20000;
// const api = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout,
// });
// let refreshInProgress = false;
// api.interceptors.request.use(async (config) => {
//   const userData = getJsonItemFromLocalStorage('userInformation');
//   const business = getJsonItemFromLocalStorage('business');
//   const token = userData?.token;
//   const cooperateID = userData?.cooperateID;
//   const businessId = business?.businessId;

//   if (
//     userData?.tokenExpiry &&
//     now >= userData?.tokenExpiry - TOKEN_REFRESH_WINDOW &&
//     !refreshInProgress
//   ) {
//     refreshInProgress = true;
//     const newToken = await refreshToken();
//     refreshInProgress = false;

//     if (newToken) {
//       config.headers.Authorization = `Bearer ${newToken}`;
//     }
//   } else {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   if (cooperateID) {
//     config.headers['cooperateId'] = cooperateID;
//   }
//   if (businessId) {
//     config.headers['businessId'] = businessId;
//   }

//   const isMultipartFormData =
//     config.headers['Content-Type'] === 'multipart/form-data';
//   if (isMultipartFormData) {
//     delete config.headers['Content-Type'];
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       logout();
//     }
//     if (error.code === 'ERR_BAD_REQUEST') {
//       handleError(error);
//       return error;
//     } else {
//       handleError(error);
//     }
//   }
// );

// export default api;

'use client';

import {
  getJsonItemFromLocalStorage,
  notify,
  removeCookie,
  saveJsonItemToLocalStorage,
} from '@/lib/utils';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { generateRefreshToken } from './controllers/auth';

export const TOKEN_EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes
export const REFRESH_BEFORE_EXPIRY = 1 * 60 * 1000; // 1 minute before expiry

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const timeout = 20000;

let refreshTimer: NodeJS.Timeout | null = null;

const logout = async () => {
  toast.error('Session Expired, please log in again.');
  window.location.href = '/auth/login';
  localStorage.clear();
  removeCookie('token');
};

export const refreshToken = async () => {
  const userData = getJsonItemFromLocalStorage('userInformation');
  if (!userData) return null;

  const { token, email } = userData;

  try {
    const response = await generateRefreshToken({
      token,
      email,
    });

    const newToken = response?.data?.data?.jwtToken;

    const newExpiry = Date.now() + TOKEN_EXPIRY_DURATION;
    saveJsonItemToLocalStorage('userInformation', {
      ...userData,
      token: newToken,
      tokenExpiry: newExpiry,
    });

    scheduleTokenRefresh();
    return newToken;
  } catch (error) {
    logout();
    return null;
  }
};

export const scheduleTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  const userData = getJsonItemFromLocalStorage('userInformation');
  if (!userData || !userData.tokenExpiry) return;

  const timeUntilRefresh =
    userData.tokenExpiry - Date.now() - REFRESH_BEFORE_EXPIRY;

  refreshTimer = setTimeout(() => {
    refreshToken();
  }, Math.max(0, timeUntilRefresh));
};

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout,
});

api.interceptors.request.use(async (config) => {
  const userData = getJsonItemFromLocalStorage('userInformation');
  const business = getJsonItemFromLocalStorage('business');
  const token = userData?.token;
  const cooperateID = userData?.cooperateID;
  const businessId = business?.businessId;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (cooperateID) {
    config.headers['cooperateId'] = cooperateID;
  }

  if (businessId) {
    config.headers['businessId'] = businessId;
  }

  const isMultipartFormData =
    config.headers['Content-Type'] === 'multipart/form-data';
  if (isMultipartFormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      logout();
    } else {
      handleError(error, false);
    }
    return Promise.reject(error);
  }
);

export const handleError = (error: any, showError: boolean = true) => {
  if (showError) {
    if (!error.response?.data?.title) {
      notify({
        title: 'Error!',
        text:
          error.response?.data?.error?.responseDescription ||
          'An error occurred',
        type: 'error',
      });
    } else if (error.code === 'ECONNABORTED') {
      notify({
        title: 'Network Timeout',
        text: 'The request took too long. Please try again later.',
        type: 'error',
      });
    } else if (error.code === 'ERR_NETWORK') {
      notify({
        title: 'Network Error!',
        text: 'Check your network and try again',
        type: 'error',
      });
    } else {
      notify({
        title: 'Error!',
        text: 'An error occurred, please try again',
        type: 'error',
      });
    }
  }
};

scheduleTokenRefresh();

export default api;
