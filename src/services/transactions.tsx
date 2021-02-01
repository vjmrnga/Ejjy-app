import axios from 'axios';
import { IGetRequest } from './interfaces';

export const service = {
	list: async (params: IGetRequest, baseURL) => axios.get('/transactions/', { baseURL, params }),
};
