import axios from 'axios';
import { NO_VERIFICATION_CONFIG } from '.';

interface Login {
	login: string;
	password: string;
}

interface AcquireToken {
	username: string;
	password: string;
}

const service = {
	login: async (body: Login, baseURL) =>
		axios.post('users/login/', body, { baseURL, ...NO_VERIFICATION_CONFIG }),

	retrieve: async (id: number, baseURL) =>
		axios.get(`users/${id}/`, { baseURL }),

	acquireToken: async (body: AcquireToken, baseURL) =>
		axios.post('tokens/acquire/', body, { baseURL, ...NO_VERIFICATION_CONFIG }),

	logout: async (id: number, baseURL) =>
		axios.post(`users/${id}/logout/`, null, { baseURL }),
};

export default service;
