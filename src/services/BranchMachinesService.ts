import axios from 'axios';

interface Modify {
	name: string;
	server_url?: string;
	pos_terminal?: string;
}

const service = {
	create: async (body: Modify, baseURL) =>
		axios.post('/branch-machines/', body, { baseURL }),

	edit: async (id: number, body: Modify, baseURL) =>
		axios.patch(`/branch-machines/${id}/`, body, { baseURL }),
};

export default service;
