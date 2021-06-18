import axios from 'axios';
import { ONLINE_API_URL } from './index';

export const service = {
	test: async () => axios.get('branches/', { baseURL: ONLINE_API_URL }),
};
