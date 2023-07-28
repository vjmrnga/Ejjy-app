import { Button, Calendar, message, Modal, Space, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	ReportTimeRangeModal,
	RequestErrors,
	TableHeader,
	ViewXReadReportModal,
	ViewZReadReportModal,
} from 'components';
import { FieldError } from 'components/elements';
import { branchMachineTypes, EMPTY_CELL, MAX_PAGE_SIZE } from 'global';
import {
	useBranchMachines,
	useCashieringSessions,
	useXReadReportCreate,
	useZReadReportCreate,
} from 'hooks';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import {
	convertIntoArray,
	formatDateTime,
	getFullName,
	isUserFromBranch,
} from 'utils';

interface Props {
	branchId: string | number;
	isDisableZReadButton?: boolean;
	tableHeaderClassName?: string;
}

const branchMachineCashieringTypes = [
	branchMachineTypes.CASHIERING,
	branchMachineTypes.SCALE_AND_CASHIERING,
];

const BRANCH_MACHINES_REFETCH_INTERVAL_MS = 2500;

export const ReportsPerMachine = ({
	branchId,
	isDisableZReadButton,
	tableHeaderClassName,
}: Props) => {
	// STATES
	const [xReadReport, setXReadReport] = useState(null);
	const [zReadReport, setZReadReport] = useState(null);
	const [dataSource, setDataSource] = useState([]);
	const [selectedBranchMachine, setSelectedBranchMachine] = useState(null);
	const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
	const [sessionPickerModalVisible, setSessionPickerModalVisible] =
		useState(false);
	const [isExportEjournalModalVisible, setIsExportEjournalModalVisible] =
		useState(false);

	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const {
		data: { branchMachines },
		isFetching: isFetchingBranchMachines,
		isFetchedAfterMount: isBranchMachinesFetchedAfterMount,
		error: branchMachinesError,
	} = useBranchMachines({
		params: {
			branchId,
			pageSize: MAX_PAGE_SIZE,
		},
		options: { refetchInterval: BRANCH_MACHINES_REFETCH_INTERVAL_MS },
	});

	const {
		mutateAsync: createXReadReport,
		isLoading: isCreatingXReadReport,
		error: createXReadReportError,
	} = useXReadReportCreate();
	const {
		mutateAsync: createZReadReport,
		isLoading: isCreatingZReadReport,
		error: createZReadReportError,
	} = useZReadReportCreate();

	// METHODS
	useEffect(() => {
		const formattedBranchMachines = branchMachines.map((branchMachine) => ({
			key: branchMachine.id,
			machine: branchMachine.name,
			connectivityStatus: branchMachine.is_online ? (
				<Tag color="green">Online</Tag>
			) : (
				<Tag color="red">Offline</Tag>
			),
			actions: branchMachineCashieringTypes.includes(branchMachine.type) ? (
				<Space>
					<Button
						type="primary"
						onClick={() => {
							setSelectedBranchMachine(branchMachine);
							setSessionPickerModalVisible(true);
						}}
					>
						View XRead (Session)
					</Button>
					<Button
						type="primary"
						onClick={() => {
							setSelectedBranchMachine(branchMachine);
							setDatePickerModalVisible(true);
						}}
					>
						View XRead (Date)
					</Button>
					<Button
						disabled={isDisableZReadButton}
						type="primary"
						onClick={() => viewZReadReport(branchMachine)}
					>
						View ZRead
					</Button>
				</Space>
			) : null,
		}));

		setDataSource(formattedBranchMachines);
	}, [branchMachines]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType = [
			{ title: 'Machine', dataIndex: 'machine' },
			{ title: 'Actions', dataIndex: 'actions' },
		];

		if (isUserFromBranch(user.user_type)) {
			columns.splice(1, 0, {
				title: 'Connectivity Status',
				dataIndex: 'connectivityStatus',
				align: 'center',
			});
		}

		return columns;
	}, [user]);

	const viewXReadReport = async (
		branchMachine,
		{ date = undefined, cashieringSessionId = undefined },
	) => {
		const { data, status } = await createXReadReport({
			branchMachineId: branchMachine.id,
			date,
			cashieringSessionId,
			userId: user.id,
		});

		if (status === 204) {
			message.warn('There is no active session.');
		}

		setXReadReport(data);
		setSelectedBranchMachine(null);
	};

	const viewZReadReport = async (branchMachine) => {
		const { data } = await createZReadReport({
			branchMachineId: branchMachine.id,
			userId: user.id,
		});
		setZReadReport(data);
	};

	const handleSubmitDateSelection = (date) => {
		viewXReadReport(selectedBranchMachine, {
			date: date.format('YYYY-MM-DD'),
		});

		setDatePickerModalVisible(false);
	};

	const handleSessionSelection = (cashieringSessionId) => {
		viewXReadReport(selectedBranchMachine, {
			cashieringSessionId,
		});
		setSessionPickerModalVisible(false);
	};

	return (
		<>
			<TableHeader
				buttons={
					<Button
						loading={false}
						type="primary"
						ghost
						onClick={() => setIsExportEjournalModalVisible(true)}
					>
						Generate E-journal
					</Button>
				}
				title="Reports per Machine"
				wrapperClassName={tableHeaderClassName}
			/>

			<RequestErrors
				errors={[
					...convertIntoArray(branchMachinesError),
					...convertIntoArray(createXReadReportError?.errors),
					...convertIntoArray(createZReadReportError?.errors),
				]}
				withSpaceBottom
			/>

			<Table
				columns={getColumns()}
				dataSource={dataSource}
				loading={
					isCreatingXReadReport ||
					isCreatingZReadReport ||
					(isFetchingBranchMachines && !isBranchMachinesFetchedAfterMount)
				}
				pagination={false}
				scroll={{ x: 650 }}
				bordered
			/>

			{xReadReport && (
				<ViewXReadReportModal
					report={xReadReport}
					onClose={() => setXReadReport(null)}
				/>
			)}

			{zReadReport && (
				<ViewZReadReportModal
					report={zReadReport}
					onClose={() => setZReadReport(null)}
				/>
			)}

			{datePickerModalVisible && selectedBranchMachine && (
				<DatePickerModal
					onClose={() => setDatePickerModalVisible(false)}
					onSubmit={handleSubmitDateSelection}
				/>
			)}

			{sessionPickerModalVisible && selectedBranchMachine && (
				<SessionPickerModal
					branchMachine={selectedBranchMachine}
					onClose={() => setSessionPickerModalVisible(false)}
					onSubmit={handleSessionSelection}
				/>
			)}

			{isExportEjournalModalVisible && (
				<ReportTimeRangeModal
					onClose={() => setIsExportEjournalModalVisible(null)}
				/>
			)}
		</>
	);
};

const DatePickerModal = ({ onSubmit, onClose }) => {
	// STATES
	const [selectedDate, setSelectedDate] = useState(moment());
	const [dateError, setDateError] = useState(null);

	// METHODS
	const handleOk = () => {
		if (selectedDate.isAfter(moment(), 'day')) {
			setDateError("Date must not be after today's date.");
			return;
		}

		onSubmit(selectedDate);
	};

	return (
		<Modal
			className="Modal__hasFooter"
			okButtonProps={{
				disabled: !selectedDate || !!dateError,
			}}
			title="Select Date"
			visible
			onCancel={onClose}
			onOk={handleOk}
		>
			<Calendar
				defaultValue={moment()}
				disabledDate={(current) => current.isAfter(moment(), 'date')}
				fullscreen={false}
				onSelect={(value) => {
					setSelectedDate(value);
					setDateError(null);
				}}
			/>
			{dateError && <FieldError error={dateError} />}
		</Modal>
	);
};

const cashieringSessionColumns = [
	{ title: 'Session', dataIndex: 'session' },
	{ title: 'User', dataIndex: 'user' },
];

const SessionPickerModal = ({ branchMachine, onSubmit, onClose }) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedRowKey, setSelectedRowKey] = useState(null);

	// CUSTOM HOOKS
	const {
		data: { cashieringSessions },
		isFetching: isFetchingCashieringSessions,
		error: cashieringSessionErrors,
	} = useCashieringSessions({
		params: {
			timeRange: 'daily',
			branchMachineId: branchMachine.id,
			pageSize: MAX_PAGE_SIZE,
		},
	});

	// METHODS
	useEffect(() => {
		if (cashieringSessions) {
			const formattedCashieringSessions = cashieringSessions.map((cs) => {
				const { id, datetime_started, datetime_ended, user } = cs;

				return {
					key: id,
					session: `${
						datetime_started ? formatDateTime(datetime_started) : ''
					} - ${datetime_ended ? formatDateTime(datetime_ended) : ''}`,
					user: user ? getFullName(user) : EMPTY_CELL,
				};
			});

			setDataSource(formattedCashieringSessions);
		}
	}, [cashieringSessions]);

	return (
		<Modal
			className="Modal__hasFooter"
			okButtonProps={{
				disabled: !selectedRowKey,
			}}
			title="Select Cashiering Session"
			visible
			onCancel={onClose}
			onOk={() => {
				onSubmit(selectedRowKey);
			}}
		>
			<RequestErrors
				errors={convertIntoArray(cashieringSessionErrors)}
				withSpaceBottom
			/>

			<Table
				columns={cashieringSessionColumns}
				dataSource={dataSource}
				loading={isFetchingCashieringSessions}
				pagination={false}
				rowSelection={{
					type: 'radio',
					selectedRowKeys: [selectedRowKey],
					onSelect: ({ key }) => {
						setSelectedRowKey(key);
					},
				}}
				bordered
			/>
		</Modal>
	);
};
