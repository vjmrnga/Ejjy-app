import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { XReadReportsService } from 'services';
import { getLocalApiUrl } from 'utils';

const useXReadReports = ({ params }: Query) =>
	useQuery<any>(
		[
			'useXReadReports',
			params?.branchMachineId,
			params?.isWithDailySalesData,
			params?.page,
			params?.pageSize,
			params?.timeRange,
		],
		() =>
			wrapServiceWithCatch(
				XReadReportsService.list(
					{
						branch_machine_id: params?.branchMachineId,
						is_with_daily_sales_data: params?.isWithDailySalesData,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						time_range: params?.timeRange,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				xReadReports: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useXReadReports;
