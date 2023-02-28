import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { UserPendingApprovalsService } from 'services';
import { getLocalApiUrl } from 'utils';

const useUserPendingApprovals = ({ options }: Query = {}) =>
	useQuery<any>(
		['useUserPendingApprovals'],
		() =>
			wrapServiceWithCatch(
				UserPendingApprovalsService.listOffline(getLocalApiUrl()),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				userPendingApprovals: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export default useUserPendingApprovals;
