import axios from 'axios';

interface ICreateDeliveryReceipt {
	order_slip_id: number;
}

export const service = {
	getById: async (id, baseURL) => axios.get(`/delivery-receipts/${id}/`, { baseURL }),

	create: async (body: ICreateDeliveryReceipt, baseURL) =>
		axios.post('/delivery-receipts/', body, { baseURL }),
};
