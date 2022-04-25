import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { ONLINE_API_URL, ProductChecksService } from 'services';
import { getLocalIpAddress } from 'utils/function';

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
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
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
			ProductChecksService.retrieve(
				id,
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			select: (query) => query.data,
			...options,
		},
	);

export const useProductCheckCreateDaily = (options = {}) =>
	useMutation<any, any, any>(
		() =>
			ProductChecksService.createDailyChecks(
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		options,
	);

export const useProductCheckCreateRandom = (options = {}) =>
	useMutation<any, any, any>(
		() =>
			ProductChecksService.createRandomChecks(
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		options,
	);

export const useProductCheckFulfill = (options = {}) =>
	useMutation<any, any, any>(
		({ id, products }) =>
			ProductChecksService.fulfill(
				id,
				{ products },
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		options,
	);

export default useProductChecks;
