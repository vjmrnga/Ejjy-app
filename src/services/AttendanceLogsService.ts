import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	attendance_category?: 'attendance' | 'tracker';
	attendance_type?: 'in' | 'out';
	branch_id?: number;
	employee_id?: number;
	time_range?: string;
}

interface ListForPrinting extends IListRequest {
	employee_id?: number;
	time_range?: string;
}

interface Resolve {
	suggested_resolved_clock_out_time: string;
}

interface ApproveOrDecline {
	is_approved: boolean;
}

interface Edit {
	real_time: string;
}

const service = {
	list: async (params: List, baseURL: string) =>
		axios.get('/attendance-logs/', { baseURL, params }),

	listProblematics: async (params: List, baseURL: string) =>
		axios.get('/attendance-logs/problematic/', { baseURL, params }),

	listForPrinting: async (params: ListForPrinting, baseURL: string) =>
		axios.get('/attendance-logs/for-printing/', { baseURL, params }),

	edit: async (id: number, body: Edit, baseURL) =>
		axios.patch(`/attendance-logs/${id}/`, body, { baseURL }),

	resolve: async (id: number, body: Resolve, baseURL: string) =>
		axios.post(`attendance-logs/${id}/resolve-problematic/`, body, { baseURL }),

	approveOrDecline: async (
		id: number,
		body: ApproveOrDecline,
		baseURL: string,
	) =>
		axios.post(`attendance-logs/${id}/approve-or-decline-problematic/`, body, {
			baseURL,
		}),
};

const serviceOffline = {
	listOffline: async (params: List, baseURL: string) =>
		axios.get('/offline-attendance-logs/', { baseURL, params }),
};

export default {
	...service,
	...serviceOffline,
};
