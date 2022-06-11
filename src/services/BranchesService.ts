import axios from 'axios';
import { IListRequest } from './interfaces';

const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/branches/', { baseURL, params }),
};

export default service;
