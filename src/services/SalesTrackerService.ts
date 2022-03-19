import axios from 'axios';
import { IListRequest } from './interfaces';

const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/sales-tracker/', { baseURL, params }),
};

export default service;
