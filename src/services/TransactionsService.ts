import axios from 'axios';
import { IListRequest } from './interfaces';

interface IList extends IListRequest {
	branch_machine_id?: number;
	is_adjusted: boolean;
	mode_of_payment?: string;
	payor_creditor_account_id?: number;
	statuses?: string;
	time_range?: string;
}

const service = {
	list: async (params: IList, baseURL) =>
		axios.get('/transactions/', { baseURL, params }),

	retrieve: async (id: number, baseURL) =>
		axios.get(`/transactions/${id}/`, { baseURL }),
};

export default service;
