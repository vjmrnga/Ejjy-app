import { MAX_PAGE_SIZE, NOTIFICATION_INTERVAL_MS } from 'global';
import { useBranches } from 'hooks';
import { useEffect } from 'react';
import { useNotificationStore } from '../stores/useNotificationStore';

const useNotificationConnectivity = () => {
	const setConnectivityCount = useNotificationStore(
		(state: any) => state.setConnectivityCount,
	);
	const {
		data: { branches },
	} = useBranches({
		params: { pageSize: MAX_PAGE_SIZE },
		options: { refetchInterval: NOTIFICATION_INTERVAL_MS },
	});

	useEffect(() => {
		const count = branches.reduce(
			(prev, { is_online }) => prev + (is_online === false ? 1 : 0),
			0,
		);

		setConnectivityCount(count);
	}, [branches]);
};

export default useNotificationConnectivity;
