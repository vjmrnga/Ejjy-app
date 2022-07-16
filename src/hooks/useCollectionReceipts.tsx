import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { CollectionReceiptsService } from 'services';
import { getLocalApiUrl } from 'utils';

const useCollectionReceipts = ({ params, options }: Query) =>
	useQuery<any>(
		['useCollectionReceipts', params?.page, params?.pageSize],
		() =>
			wrapServiceWithCatch(
				CollectionReceiptsService.list(
					{
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				collectionReceipts: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export default useCollectionReceipts;
