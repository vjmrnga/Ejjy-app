import { useQuery } from 'react-query';
import { IS_APP_LIVE } from '../global/constants';
import { CollectionReceiptsService, ONLINE_API_URL } from '../services';
import { getLocalIpAddress } from '../utils/function';

const useCollectionReceipts = ({ params }) =>
	useQuery<any>(
		['useCollectionReceipts', params.page, params.pageSize],
		async () =>
			CollectionReceiptsService.list(
				{
					page: params.page,
					page_size: params.pageSize,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			refetchOnWindowFocus: false,
			retry: false,
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				collectionReceipts: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useCollectionReceipts;
