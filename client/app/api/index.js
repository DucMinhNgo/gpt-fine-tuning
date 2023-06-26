import axios from 'axios';
import API from './request';

const url = 'http://localhost:3001';

/**
 * parse Params
 * @param {*} obj
 * @returns
 */
export const parseParams = (obj = {}) =>
  Object.entries(obj)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

export const createAnswer = ({ text, controller, modelSelected }) => {

  const data = {
    prompt: text,
    model: modelSelected || 'davinci:ft-personal-2023-06-13-16-57-57'
  };

  return axios.get(`${url}/create-completion?${parseParams(data)}`);;
}

/**
 * get Answers
 * @param {*} param0 
 * @returns 
 */
export const getModelList = () => {
  const data = {
    status: 'succeeded'
  };

  return axios.get(`${url}/get-list-fine-turning?${parseParams(data)}`);
}