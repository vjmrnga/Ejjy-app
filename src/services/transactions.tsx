import axios from 'axios';
import { IListRequest } from './interfaces';

export const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/transactions/', { baseURL, params }),
};
