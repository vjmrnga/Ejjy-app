import axios from 'axios';
import { IGetRequest } from './interfaces';

interface ICreateProduct {
	barcode: string;
	name: string;
	type: 'Wet' | 'Dry';
	unit_of_measurement: 'Weighing' | 'Non-Weighing';
	print_details: string;
	description: string;
	allowable_spoilage?: number;
	cost_per_piece: number;
	cost_per_bulk: number;
	reorder_point: number;
	max_balance: number;
	price_per_piece: number;
	price_per_bulk: number;
}

interface IEditProduct {
	id: number;
	barcode?: string;
	name?: string;
	type?: 'Wet' | 'Type';
	unit_of_measurement?: 'Weighing' | 'Non-Weighing';
	print_details?: string;
	description?: string;
	allowable_spoilage?: number;
	cost_per_piece?: number;
	cost_per_bulk?: number;
	reorder_point?: number;
	max_balance?: number;
	price_per_piece?: number;
	price_per_bulk?: number;
}

export const service = {
	list: async (params: IGetRequest) => axios.get('/products/', { params }),
	createProduct: async (body: ICreateProduct) => axios.post('/products/', body),
	editProduct: async (body: IEditProduct) => axios.patch(`/products/${body.id}/`, body),
	removeProduct: async (id) => axios.delete(`/products/${id}/`),
};
