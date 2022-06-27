import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { SiteSettingsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const usePingOnlineServer = () => {
	const [isEnabled, setIsEnabled] = useState(false);
	const [isConnected, setIsConnected] = useState(null);

	useQuery(
		['usePingOnlineServer', isEnabled],
		() =>
			SiteSettingsService.retrieve(getOnlineApiUrl()).catch((e) =>
				Promise.reject(e.errors),
			),
		{
			enabled: isEnabled,
			notifyOnChangeProps: ['data'],
			refetchInterval: 10000,
			onSettled: (_data, error) => {
				setIsConnected(!error);
			},
		},
	);

	useEffect(() => {
		const localApiUrl = getLocalApiUrl();
		const onlineApiUrl = getOnlineApiUrl();

		if (localApiUrl && onlineApiUrl && localApiUrl !== onlineApiUrl) {
			setIsEnabled(true);
		}
	}, []);

	return { isConnected };
};

export default usePingOnlineServer;
