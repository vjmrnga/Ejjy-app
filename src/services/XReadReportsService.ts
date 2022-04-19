import axios from 'axios';

interface Create {
	branch_machine_id: number;
	date: string;
	user_id: number;
}

const service = {
	create: async (body: Create, baseURL) =>
		axios.post('/xread-reports/', body, { baseURL }),
};

export default service;
