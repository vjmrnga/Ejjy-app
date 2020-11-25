import axios from 'axios';
import { IGetRequest } from './interfaces';

interface IListSessions extends IGetRequest {
	branch_id: number;
}

export const service = {
	list: async (params: IListSessions) => axios.get('/cashiering-sessions/', { params }),
};
