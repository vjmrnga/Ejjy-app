import { wrapServiceWithCatch } from 'hooks/helper';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { SiteSettingsService } from 'services';
import { useUserStore } from 'stores';
import {
	getLocalApiUrl,
	getOnlineApiUrl,
	isStandAlone,
	isUserFromBranch,
} from 'utils';

const usePingOnlineServer = () => {
	// STATES
	const [isEnabled, setIsEnabled] = useState(false);
	const [isConnected, setIsConnected] = useState(null);

	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);

	useQuery(
		['usePingOnlineServer', isEnabled],
		() => wrapServiceWithCatch(SiteSettingsService.retrieve(getOnlineApiUrl())),
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

		if (
			localApiUrl &&
			onlineApiUrl &&
			!isStandAlone() &&
			!isUserFromBranch(user.user_type)
		) {
			setIsEnabled(true);
		}
	}, [user]);

	return { isConnected };
};

export default usePingOnlineServer;
