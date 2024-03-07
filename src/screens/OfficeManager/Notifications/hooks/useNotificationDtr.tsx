import { attendanceCategories } from 'ejjy-global';
import { MAX_PAGE_SIZE, serviceTypes } from 'global';
import { useAttendanceLogs, useProblematicAttendanceLogs } from 'hooks';
import { useEffect } from 'react';
import { useNotificationStore } from '../stores/useNotificationStore';

const useNotificationDtr = () => {
	const setDtrCount = useNotificationStore((state: any) => state.setDtrCount);

	const { isSuccess: isAttendanceLogsSuccess } = useAttendanceLogs({
		params: {
			pageSize: MAX_PAGE_SIZE,
			serviceType: serviceTypes.OFFLINE,
		},
		options: { notifyOnChangeProps: ['isSuccess'] },
	});
	const {
		data: { total: problematicAttendanceLogsCount },
	} = useProblematicAttendanceLogs({
		params: {
			attendanceCategory: attendanceCategories.ATTENDANCE,
			pageSize: MAX_PAGE_SIZE,
		},
		options: {
			enabled: isAttendanceLogsSuccess,
			notifyOnChangeProps: ['data'],
		},
	});
	const {
		data: { total: problematicTrackerLogsCount },
	} = useProblematicAttendanceLogs({
		params: {
			attendanceCategory: attendanceCategories.TRACKER,
			pageSize: MAX_PAGE_SIZE,
		},
		options: {
			enabled: isAttendanceLogsSuccess,
			notifyOnChangeProps: ['data'],
		},
	});

	useEffect(() => {
		setDtrCount(problematicAttendanceLogsCount + problematicTrackerLogsCount);
	}, [problematicAttendanceLogsCount, problematicTrackerLogsCount]);
};

export default useNotificationDtr;
