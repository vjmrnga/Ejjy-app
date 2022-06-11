import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { CollectionReceiptsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useCollectionReceipts = ({ params }: Query) =>
	useQuery<any>(
		['useCollectionReceipts', params?.page, params?.pageSize],
		async () =>
			CollectionReceiptsService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				collectionReceipts: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useCollectionReceipts;
