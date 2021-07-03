import axios from 'axios';

interface ReceivedProducts {
	order_slip_product_id: number;
	received_quantity_piece: number;
}

interface IReceiveDeliveryReceipt {
	id: number;
	order_slip_id: number;
	receiving_user_id: number;
	received_products: ReceivedProducts[];
}

export const service = {
	getById: async (id, baseURL) =>
		axios.get(`/delivery-receipts/${id}/`, { baseURL }),

	receive: async (body: IReceiveDeliveryReceipt, baseURL) =>
		axios.post(`/delivery-receipts/${body.id}/receive/`, body, { baseURL }),
};
