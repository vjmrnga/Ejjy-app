import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, timeRangeTypes } from 'global/';
import { wrapServiceWithCatch } from 'hooks/helper';
import { useQuery } from 'react-query';
import { BirReportsService } from 'services';
import { getLocalApiUrl } from 'utils';
import { Query } from './inteface';

const useBirReports = ({ params, options }: Query) =>
	useQuery<any>(
		[
			'useBirReports',
			params?.branchMachineId,
			params?.timeRange,
			params?.page,
			params?.pageSize,
		],
		() =>
			wrapServiceWithCatch(
				BirReportsService.list(
					{
						branch_machine_id: params?.branchMachineId,
						time_range: params?.timeRange || timeRangeTypes.DAILY,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				birReports: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export default useBirReports;
