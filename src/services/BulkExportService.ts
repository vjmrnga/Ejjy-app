import axios from 'axios';

type BulkExportData = {
	contents: string;
	file_name: string;
};

interface BulkExport {
	data: BulkExportData[];
	folder_name: string;
}

const service = {
	bulkExportReports: async (body: BulkExport, baseURL: string) =>
		axios.post('/reports/bulk-export/', body, { baseURL }),
};

export default service;
