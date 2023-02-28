import axios from 'axios';

const serviceOffline = {
	listOffline: async (baseURL) =>
		axios.get('/offline-user-pending-approvals/', { baseURL }),
};

export default serviceOffline;
