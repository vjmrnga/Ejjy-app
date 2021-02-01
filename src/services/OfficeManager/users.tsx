import axios from 'axios';
import { IGetRequest } from '../interfaces';

export const service = {
	list: async (params: IGetRequest, baseURL) => axios.get('/users/', { baseURL, params }),

	getById: async (id, baseURL) => axios.get(`/users/${id}/`, { baseURL }),
};
