import axios from 'axios';
import { IGetRequest } from './interfaces';

interface IListTransactions extends IGetRequest {
	branch_id: number;
}

export const service = {
	list: async (params: IListTransactions) => axios.get('/transactions/', { params }),
};
