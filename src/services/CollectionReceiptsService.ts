import axios from 'axios';
import { IListRequest } from './interfaces';

const service = {
	list: async (params: IListRequest, baseURL: string) =>
		axios.get('/collection-receipts/', { baseURL, params }),
};

export default service;
