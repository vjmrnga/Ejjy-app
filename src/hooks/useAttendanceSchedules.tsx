import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { AttendanceSchedulesService } from 'services';
import { getLocalApiUrl } from 'utils';

const useAttendanceSchedules = ({ params }: Query) =>
	useQuery<any>(
		[
			'useAttendanceSchedules',
			params?.page,
			params?.pageSize,
			params?.employeeId,
		],
		() =>
			wrapServiceWithCatch(
				AttendanceSchedulesService.list(
					{
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						employee_id: params?.employeeId,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				attendanceSchedules: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useAttendanceScheduleBulkEdit = () =>
	useMutation<any, any, any>(({ schedules }: any) =>
		AttendanceSchedulesService.bulkEdit({ schedules }, getLocalApiUrl()),
	);

export const useAttendanceScheduleEdit = () =>
	useMutation<any, any, any>(({ id, attendanceTime }: any) =>
		AttendanceSchedulesService.edit(
			id,
			{ attendance_time: attendanceTime },
			getLocalApiUrl(),
		),
	);

export default useAttendanceSchedules;
