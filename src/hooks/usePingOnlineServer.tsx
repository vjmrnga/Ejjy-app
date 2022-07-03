import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { SiteSettingsService } from 'services';
import {
	getLocalApiUrl,
	getOnlineApiUrl,
	isCUDShown,
	isStandAlone,
	isUserFromBranch,
} from 'utils';

const usePingOnlineServer = () => {
	// STATES
	const [isEnabled, setIsEnabled] = useState(false);
	const [isConnected, setIsConnected] = useState(null);

	// CUSTOM HOOKS
	const { user } = useAuth();

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
