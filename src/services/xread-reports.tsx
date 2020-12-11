import axios from 'axios';

interface ICreateXreadReport {
	branch_machine_id: number;
	user_id: number;
}

export const service = {
	create: async (body: ICreateXreadReport) => axios.post('/xread-reports/', body),
};
