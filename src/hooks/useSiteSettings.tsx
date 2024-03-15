import {
	ServiceType,
	useSiteSettings as useSiteSettingsGlobal,
} from 'ejjy-global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { SiteSettingsService } from 'services';
import { getLocalApiUrl, isStandAlone } from 'utils';

const SITE_SETTINGS_STALE_TIME = 10000;

export const useSiteSettingsNew = () =>
	useSiteSettingsGlobal({
		serviceOptions: {
			baseURL: getLocalApiUrl(),
			type: isStandAlone() ? ServiceType.ONLINE : ServiceType.OFFLINE,
		},
	});

export const useSiteSettings = ({ params, options }: Query = {}) =>
	useQuery<any>(
		['useSiteSettingsLegacy', params?.branchId],
		() => {
			const service = isStandAlone()
				? SiteSettingsService.retrieve
				: SiteSettingsService.retrieveOffline;

			return wrapServiceWithCatch(service(getLocalApiUrl()));
		},
		{
			select: (query) => query.data,
			refetchOnMount: 'always',
			staleTime: SITE_SETTINGS_STALE_TIME,
			...options,
		},
	);
