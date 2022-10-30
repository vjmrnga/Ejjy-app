import axios from 'axios';
import { IListRequest } from 'services/interfaces';

interface List extends IListRequest {
	time_range?: string;
}

const service = {
	list: async (params: List, baseURL: string) =>
		axios.get('/cashiering-sessions/', { baseURL, params }),
};

export default service;
