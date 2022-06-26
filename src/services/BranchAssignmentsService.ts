import axios from 'axios';

interface Modify {
	user_id: number;
	branch_id: number;
}

const service = {
	create: async (body: Modify, baseURL) =>
		axios.post('/branch-assignments/', body, { baseURL }),
};

export default service;
