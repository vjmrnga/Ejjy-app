import axios from 'axios';

interface IEditLocalBranchSettings {
	backup_server_url: string;
}

export const service = {
	retrieve: async (baseURL) =>
		axios.get('/local-branches-settings/', { baseURL }),

	edit: async (id: number, body: IEditLocalBranchSettings, baseURL) =>
		axios.patch(`/local-branches-settings/${id}/`, body, { baseURL }),
};
