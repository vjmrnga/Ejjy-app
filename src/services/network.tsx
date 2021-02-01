import axios from 'axios';
import { ONLINE_API_URL } from './index';

export const service = {
	test: async (body: any) => axios.post('tokens/access/verify/', body, { baseURL: ONLINE_API_URL }),
};
