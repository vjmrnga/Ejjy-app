import { connectivityTypes } from 'global';
import { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { ConnectivityLogsService, SiteSettingsService } from 'services';
import { getLocalApiUrl, getLocalBranchId, getOnlineApiUrl } from 'utils';

const serverUrl = getOnlineApiUrl();
const branchId = Number(getLocalBranchId());

const useConnectivity = () => {
	const [isConnected, setIsConnected] = useState(null);
	const isConnectedRef = useRef(null);

	useQuery(
		['useConnectivity'],
		() =>
			SiteSettingsService.retrieve(serverUrl).catch((e) =>
				Promise.reject(e.errors),
			),
		{
			refetchInterval: 5000,
			select: (query) => query.data,
			onSettled: (_data, error) => {
				const isConnectedNew = !error;

				if (isConnectedRef.current !== isConnectedNew) {
					ConnectivityLogsService.create(
						{
							branch_id: branchId,
							type: isConnectedNew
								? connectivityTypes.OFFLINE_TO_ONLINE
								: connectivityTypes.ONLINE_TO_OFFLINE,
						},
						getLocalApiUrl(),
					);
				}

				isConnectedRef.current = isConnectedNew;
				setIsConnected(isConnectedNew);
			},
		},
	);

	return { isConnected };
};

export default useConnectivity;
