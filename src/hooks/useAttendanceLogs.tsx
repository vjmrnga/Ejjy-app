import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { AttendanceLogsService } from 'services';
import { getLocalApiUrl } from 'utils';

const useAttendanceLogs = ({ params }: Query) =>
	useQuery<any>(
		[
			'useAttendanceLogs',
			params?.attendanceCategory,
			params?.attendanceType,
			params?.branchId,
			params?.employeeId,
			params?.page,
			params?.pageSize,
			params?.timeRange,
		],
		() =>
			wrapServiceWithCatch(
				AttendanceLogsService.list(
					{
						attendance_category: params?.attendanceCategory,
						attendance_type: params?.attendanceType,
						branch_id: params?.branchId,
						employee_id: params?.employeeId,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						page: params?.page || DEFAULT_PAGE,
						time_range: params?.timeRange,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				attendanceLogs: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useProblematicAttendanceLogs = ({ params }: Query) =>
	useQuery<any>(
		[
			'useProblematicAttendanceLogs',
			params?.attendanceCategory,
			params?.page,
			params?.pageSize,
		],
		() =>
			wrapServiceWithCatch(
				AttendanceLogsService.list(
					{
						attendance_category: params?.attendanceCategory,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				problematicAttendanceLogs: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useAttendanceLogs;
