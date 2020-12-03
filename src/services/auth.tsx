import axios from 'axios';
import { NO_VERIFICATION_CONFIG } from '.';

interface ILogin {
	login: string;
	password: string;
}

interface IAcquireToken {
	username: string;
	password: string;
}

export const service = {
	login: async (body: ILogin) => axios.post('users/login/', body, NO_VERIFICATION_CONFIG),
	retrieve: async (id: number) => axios.get(`users/${id}/`),
	acquireToken: async (body: IAcquireToken) =>
		axios.post('tokens/acquire/', body, NO_VERIFICATION_CONFIG),
};
