import axios from 'axios';

const service = {
	retrieve: async (baseURL) => axios.get('/site-settings/single/', { baseURL }),
};

const serviceOffline = {
	retrieveOffline: async (baseURL) =>
		axios.get('/offline-site-settings/single/', { baseURL }),
};

export default {
	...service,
	...serviceOffline,
};
