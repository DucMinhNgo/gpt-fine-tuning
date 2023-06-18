import axios from "axios";

// default config options
const defaultOptions = {
  baseURL: 'https://api.openai.com/v1/',
};

// create instance
const instance = axios.create(defaultOptions);

// set auth token for any request
instance.interceptors.request.use(async (config) => {
  const token="";

  config.headers.Authorization = token ? `Bearer ${token}` : '';
});

export default instance;