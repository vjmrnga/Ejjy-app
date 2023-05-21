import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	serviceTypes,
	timeRangeTypes,
} from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
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
			params?.serviceType,
			params?.timeRange,
		],
		() => {
			let service = AttendanceLogsService.list;
			if (serviceTypes.OFFLINE === params?.serviceType) {
				service = AttendanceLogsService.listOffline;
			}

			return wrapServiceWithCatch(
				service(
					{
						attendance_category: params?.attendanceCategory,
						attendance_type: params?.attendanceType,
						branch_id: params?.branchId,
						employee_id: params?.employeeId,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						page: params?.page || DEFAULT_PAGE,
						time_range: params?.timeRange || timeRangeTypes.DAILY,
					},
					getLocalApiUrl(),
				),
			);
		},
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
				AttendanceLogsService.listProblematics(
					{
						attendance_category: params?.attendanceCategory,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					},
					getLocalApiUrl(),
				),
			),
		{
			// NOTE: Different shape of response as it is not paginated
			initialData: { data: [] },
			select: (query) => ({
				problematicAttendanceLogs: query.data,
				total: query.data.length,
			}),
		},
	);

export const useAttendanceLogsForPrinting = ({ params, options }: Query) =>
	useQuery<any>(
		['useAttendanceLogsForPrinting', params?.employeeId, params?.timeRange],
		() => {
			return wrapServiceWithCatch(
				AttendanceLogsService.listForPrinting(
					{
						employee_id: params?.employeeId,
						page_size: MAX_PAGE_SIZE,
						page: DEFAULT_PAGE,
						time_range: params?.timeRange || timeRangeTypes.DAILY,
					},
					getLocalApiUrl(),
				),
			);
		},
		{
			initialData: { data: {} },
			select: (query) => ({
				dtr: query.data,
			}),
			...options,
		},
	);

export const useProblematicAttendanceLogResolve = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, suggestedResolvedClockOutTime }: any) =>
			AttendanceLogsService.resolve(
				id,
				{ suggested_resolved_clock_out_time: suggestedResolvedClockOutTime },
				getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useAttendanceLogs');
				queryClient.invalidateQueries('useProblematicAttendanceLogs');
			},
		},
	);
};

export const useProblematicAttendanceLogApproveDecline = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, isApproved }: any) =>
			AttendanceLogsService.approveOrDecline(
				id,
				{ is_approved: isApproved },
				getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useAttendanceLogs');
				queryClient.invalidateQueries('useProblematicAttendanceLogs');
			},
		},
	);
};

export default useAttendanceLogs;
