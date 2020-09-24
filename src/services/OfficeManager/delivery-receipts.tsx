import axios from 'axios';

interface ICreateDeliveryReceipt {
	order_slip_id: number;
}

export const service = {
	getById: async (id) => axios.get(`/delivery-receipts/${id}/`),
	create: async (body: ICreateDeliveryReceipt) => axios.post('/delivery-receipts/', body),
};
