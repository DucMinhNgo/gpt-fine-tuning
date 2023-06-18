import axios from 'axios';
import API from './request';

/**
 * parse Params
 * @param {*} obj
 * @returns
 */
export const parseParams = (obj = {}) =>
  Object.entries(obj)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

export const createAnswer = ({ text, controller }) => {

  const data = {
    prompt: text,
    model: 'davinci:ft-personal-2023-06-13-16-57-57'
  };

  return axios.get(`http://localhost:3000/create-completion?${parseParams(data)}`);;
}