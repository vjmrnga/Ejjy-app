import axios from 'axios';
import { IListRequest } from './interfaces';

interface IListPreparationSlipsRequest extends IListRequest {
	assigned_personnel_id?: number;
	is_ps_for_approval?: boolean;
	requesting_user_id: number;
}

interface IGetPreparationSlipByIdRequest {
	assigned_personnel_id: number;
	requesting_user_id: number;
}

interface PreparattionSlipProduct {
	order_slip_product_id: number;
	product_id: number;
	quantity_piece: number;
	fulfilled_quantity_piece: number;
	assigned_person_id: number;
}

interface IFulfillPreparationSlip {
	id: number;
	assigned_store_id: number;
	is_prepared?: boolean;
	products: PreparattionSlipProduct[];
	is_online: boolean;
}

interface IApproveOrDisapprovePreparationSlip {
	is_approved: boolean;
}

export const service = {
	list: async (params: IListPreparationSlipsRequest, baseURL) =>
		axios.get('/order-slips/with-assigned-personnel-details/', {
			baseURL,
			params,
		}),

	getById: async (id, params: IGetPreparationSlipByIdRequest, baseURL) =>
		axios.get(`/order-slips/${id}/with-assigned-personnel-details/`, {
			baseURL,
			params,
		}),

	fulfill: async (body: IFulfillPreparationSlip, baseURL) =>
		axios.patch(`/order-slips/${body.id}/`, body, { baseURL }),

	approveOrDisapprove: async (
		id,
		body: IApproveOrDisapprovePreparationSlip,
		baseURL,
	) =>
		axios.post(`/order-slips/${id}/approve-or-disapprove-ps/`, body, {
			baseURL,
		}),
};
