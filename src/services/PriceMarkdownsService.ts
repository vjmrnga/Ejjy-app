import axios from 'axios';

type CreateData = {
	branch_id: number;
	type: string;
};

interface Create {
	data: CreateData[];
	product_id: number;
}

const service = {
	create: async (body: Create, baseURL) =>
		axios.post('/price-markdowns/', body, { baseURL }),
};
export default service;
