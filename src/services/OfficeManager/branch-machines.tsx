import axios from 'axios';
import { IGetRequest } from '../interfaces';

interface IListBranchMachines extends IGetRequest {
	branch_id: number;
}

export const service = {
	list: async (params: IListBranchMachines) => axios.get('/branches-machines/', { params }),
};
