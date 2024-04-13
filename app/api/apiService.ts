'use client';
import { getJsonItemFromLocalStorage, notify } from '@/lib/utils';
import axios from 'axios';

export const handleError = (error: any) => {
  if (!error.response.data.title) {
    notify({
      title: 'Error!',
      text: error.response.data.error.responseDescription,
      type: 'error',
    });
  } else {
    notify({
      title: 'Error!',
      text: 'An error occured, please try again',
      type: 'error',
    });
  }
};

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const userData = getJsonItemFromLocalStorage('userInformation');
  const token = userData?.token;
  const cooperateID = userData?.cooperateID;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (cooperateID) {
    config.headers['cooperateId'] = cooperateID;
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
  (error) => {
    if (error.response.status === 401) {
      // window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
