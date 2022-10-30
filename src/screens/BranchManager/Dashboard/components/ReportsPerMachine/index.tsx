import { Button, Calendar, message, Modal, Space, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	RequestErrors,
	TableHeader,
	ViewXReadReportModal,
	ViewZReadReportModal,
} from 'components';
import { Box, FieldError } from 'components/elements';
import { EMPTY_CELL, MAX_PAGE_SIZE } from 'global';
import {
	useBranchMachines,
	useCashieringSessions,
	useXReadReportCreate,
	useZReadReportCreate,
} from 'hooks';
import { useAuth } from 'hooks/useAuth';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDateTime,
	getBranchId,
	getFullName,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'Machines', dataIndex: 'machines' },
	{
		title: 'Connectivity Status',
		dataIndex: 'connectivityStatus',
		align: 'center',
	},
	{ title: 'Actions', dataIndex: 'actions' },
];

export const ReportsPerMachine = () => {
	// STATES
	const [xReadReport, setXReadReport] = useState(null);
	const [zReadReport, setZReadReport] = useState(null);
	const [dataSource, setDataSource] = useState([]);

	const [selectedBranchMachine, setSelectedBranchMachine] = useState(null);

	const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
	const [sessionPickerModalVisible, setSessionPickerModalVisible] =
		useState(false);

	// CUSTOM HOOKS
	const {
		data: { branchMachines },
		isLoading: isLoadingBranchMachines,
	} = useBranchMachines({
		params: { branchId: getBranchId() },
		options: { refetchInterval: 2500 },
	});
	const { mutateAsync: createXReadReport, isLoading: isCreatingXReadReport } =
		useXReadReportCreate();
	const { mutateAsync: createZReadReport, isLoading: isCreatingZReadReport } =
		useZReadReportCreate();
	const { user } = useAuth();

	// METHODS
	useEffect(() => {
		const formattedBranchMachines = branchMachines.map((branchMachine) => ({
			key: branchMachine.id,
			machines: branchMachine.name,
			connectivityStatus: branchMachine.is_online ? (
				<Tag color="green">Online</Tag>
			) : (
				<Tag color="red">Offline</Tag>
			),
			actions: (
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
					<Button type="primary" onClick={() => viewZReadReport(branchMachine)}>
						View ZRead
					</Button>
				</Space>
			),
		}));

		setDataSource(formattedBranchMachines);
	}, [branchMachines]);

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
		<Box>
			<TableHeader title="Reports per Machine" />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={
					isCreatingXReadReport ||
					isCreatingZReadReport ||
					isLoadingBranchMachines
				}
				pagination={false}
				scroll={{ x: 650 }}
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
		</Box>
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
		isFetching,
		error,
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
			<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

			<Table
				columns={cashieringSessionColumns}
				dataSource={dataSource}
				loading={isFetching}
				pagination={false}
				rowSelection={{
					type: 'radio',
					selectedRowKeys: [selectedRowKey],
					onSelect: ({ key }) => {
						setSelectedRowKey(key);
					},
				}}
			/>
		</Modal>
	);
};
