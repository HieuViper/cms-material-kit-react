import { SET_EMAIL_INPUT, SET_PASSWORD_INPUT } from './constants';

export const setEmailInput = (payload) => ({
  type: SET_EMAIL_INPUT,
  payload,
});

export const setPasswordInput = (payload) => ({
  type: SET_PASSWORD_INPUT,
  payload,
});
