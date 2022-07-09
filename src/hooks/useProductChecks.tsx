import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ProductChecksService } from 'services';
import { getLocalApiUrl } from 'utils';

const useProductChecks = ({ params }: Query) =>
	useQuery<any>(
		[
			'useProductChecks',
			params?.isFilledUp,
			params?.onlyOfToday,
			params?.page,
			params?.pageSize,
			params?.type,
		],
		async () =>
			ProductChecksService.list(
				{
					is_filled_up: params?.isFilledUp,
					only_of_today: params?.onlyOfToday,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					page: params?.page || DEFAULT_PAGE,
					type: params?.type,
				},
				getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				productChecks: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useProductCheckRetrieve = ({ id, options }: Query) =>
	useQuery<any>(
		['useProductCheckRetrieve', id],
		async () =>
			ProductChecksService.retrieve(id, getLocalApiUrl()).catch((e) =>
				Promise.reject(e.errors),
			),
		{
			select: (query) => query.data,
			...options,
		},
	);

export const useProductCheckCreateDaily = (options = {}) =>
	useMutation<any, any, any>(
		() => ProductChecksService.createDailyChecks(getLocalApiUrl()),
		options,
	);

export const useProductCheckCreateRandom = (options = {}) =>
	useMutation<any, any, any>(
		() => ProductChecksService.createRandomChecks(getLocalApiUrl()),
		options,
	);

export const useProductCheckFulfill = (options = {}) => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, products }) =>
			ProductChecksService.fulfill(id, { products }, getLocalApiUrl()),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useProductChecks');
			},
			...options,
		},
	);
};

export default useProductChecks;
