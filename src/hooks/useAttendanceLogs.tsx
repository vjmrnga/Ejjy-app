import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { AttendanceLogsService } from 'services';
import { getLocalApiUrl } from 'utils';

const useAttendanceLogs = ({ params }: Query) =>
	useQuery<any>(
		[
			'useAttendanceLogs',
			params?.page,
			params?.attendanceCategory,
			params?.attendanceType,
			params?.branchId,
			params?.employeeId,
			params?.pageSize,
			params?.timeRange,
		],
		() =>
			wrapServiceWithCatch(
				AttendanceLogsService.list(
					{
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						time_range: params?.timeRange,
						employee_id: params?.employeeId,
						branch_id: params?.branchId,
						attendance_category: params?.attendanceCategory,
						attendance_type: params?.attendanceType,
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

export const useAttendanceLogCreate = () =>
	useMutation<any, any, any>(
		({ attendanceCategory, branchId, employeeId }: any) =>
			AttendanceLogsService.create(
				{
					attendance_category: attendanceCategory,
					branch_id: branchId,
					employee_id: employeeId,
				},
				getLocalApiUrl(),
			),
	);

export default useAttendanceLogs;
