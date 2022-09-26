import axios from 'axios';
import { IListRequest } from './interfaces';

interface Exists extends IListRequest {
	or_number: number;
}

const service = {
	checkValidity: async (params: Exists, baseURL) =>
		axios.get('/invoices/exists/', { baseURL, params }),
};

export default service;
