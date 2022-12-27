import { AsyncStorage } from 'AsyncStorage';
import axios from 'axios';
import config from './config';

export const callNon = async (url1, med, params) => {
  const options = {
    method: med,
    timeout: 15000,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    data: JSON.stringify(params),
    url: `${config.apiUrl}${url1}`,
  };
  return axios(options)
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
    });
};

export const callGet = async (url, med, params) => {
  let tk = null;
  const item = await AsyncStorage.getItem('token-admin');
  if (item === undefined || item === 'null') {
    const { token } = JSON.parse(item);
    tk = token;
  }
  const options = {
    method: med,
    timeout: 15000,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: `Token ${tk}`,
    },
    data: med === 'POST' ? JSON.stringify(params) : params,
    url: `${config.apiUrl}${url}`,
  };
  return axios(options)
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
    });
};

export const call = async (url, med, params) => {
  let tk = null;
  const item = await AsyncStorage.getItem('token-admin');
  if (item === undefined || item === 'null') {
    const { token } = JSON.parse(item);
    tk = token;
  }
  const options = {
    method: med,
    timeout: 15000,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${tk}`,
    },
    data: med === 'POST' ? JSON.stringify(params) : params,
    url: `${config.apiUrl}${url}`,
  };
  return axios(options)
    .then((response) => {
      console.log(`response = `, response);
      return response.data;
    })
    .catch((err) => {
      console.log(`err = `, err.response);
      if (err.response && err.response.data && err.response.data.message) {
        return err.response.data.message;
      }
      return err;
    });
};

export const callUpload = async (url, med, formData) => {
  let tk = null;
  const item = await AsyncStorage.getItem('token-admin');
  if (item === undefined || item === 'null') {
    const { token } = JSON.parse(item);
    tk = token;
  }
  const options = {
    method: med,
    timeout: 15000,
    headers: {
      'content-type': 'multipart/form-data',
      accept: 'application/json',
      Authorization: `Bearer ${tk}`,
    },
    data: formData,
    url: `${config.apiUrl}${url}`,
  };
  return axios(options)
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
    });
};

export const callForm = async (url, med, params) => {
  let tk = null;
  const item = await AsyncStorage.getItem('token-admin');
  if (item === undefined || item === 'null') {
    const { token } = JSON.parse(item);
    tk = token;
  }
  const options = {
    method: med,
    timeout: 15000,
    headers: {
      'content-type': 'multipart/form-data',
      accept: 'application/json',
      Authorization: `Token ${tk}`,
    },
    data: params,
    url: `${config.apiUrl}${url}`,
  };
  return axios(options)
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
    });
};
