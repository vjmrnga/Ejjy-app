import { Button, Calendar, Modal, Space, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	TableHeader,
	ViewButtonIcon,
	ViewXReadReportModal,
	ViewZReadReportModal,
} from 'components';
import { Box, FieldError } from 'components/elements';
import {
	useBranchMachines,
	useXReadReportCreate,
	useZReadReportCreate,
} from 'hooks';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';

const columns: ColumnsType = [
	{ title: 'Machines', dataIndex: 'machines' },
	{
		title: 'Connectivity Status',
		dataIndex: 'connectivityStatus',
		align: 'center',
	},
	{ title: 'Actions', dataIndex: 'actions' },
];

export const MachineReportTable = () => {
	// STATES
	const [xReadReport, setXReadReport] = useState(null);
	const [zReadReport, setZReadReport] = useState(null);
	const [dataSource, setDataSource] = useState([]);

	const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
	const [selectedBranchMachine, setSelectedBranchMachine] = useState(null);
	const [selectedDate, setSelectedDate] = useState(moment());
	const [dateError, setDateError] = useState(null);

	// CUSTOM HOOKS
	const {
		data: { branchMachines },
		isLoading: isLoadingBranchMachines,
	} = useBranchMachines({
		options: { refetchInterval: 5000 },
	});
	const { mutateAsync: createXReadReport, isLoading: isCreatingXReadReport } =
		useXReadReportCreate();
	const { mutateAsync: createZReadReport, isLoading: isCreatingZReadReport } =
		useZReadReportCreate();

	// METHODS
	useEffect(() => {
		const formattedBranchMachines = branchMachines.map((branchMachine) => {
			return {
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
							onClick={() => viewXReadReport(branchMachine)}
						>
							View XRead
						</Button>
						<Button
							type="primary"
							onClick={() => {
								setSelectedBranchMachine(branchMachine);
								setDatePickerModalVisible(true);
								setSelectedDate(moment());
							}}
						>
							View XRead by Date
						</Button>
						<Button
							type="primary"
							onClick={() => viewZReadReport(branchMachine)}
						>
							View ZRead
						</Button>
					</Space>
				),
			};
		});

		setDataSource(formattedBranchMachines);
	}, [branchMachines]);

	const viewXReadReport = async (branchMachine, date = undefined) => {
		const { data } = await createXReadReport({
			userId: 12, // TODO: Once user id (online and offline) is synced, used the `user.id` for this.
			serverUrl: branchMachine.server_url,
			date,
		});
		setXReadReport(data);

		// NOTE: Reset the states used for datepicker
		setDatePickerModalVisible(false);
		setSelectedBranchMachine(null);
		setSelectedDate(null);
		setDateError(null);
	};

	const viewZReadReport = async (branchMachine) => {
		const { data } = await createZReadReport({
			userId: 12, // TODO: Once user id (online and offline) is synced, used the `user.id` for this.
			serverUrl: branchMachine.server_url,
		});
		setZReadReport(data);
	};

	const onSubmitDateSelection = useCallback(() => {
		if (!selectedDate) {
			setDateError('No selected date yet.');
			return;
		} else if (selectedDate.isAfter(moment(), 'day')) {
			setDateError("Date must not be after today's date.");
			return;
		}

		viewXReadReport(selectedBranchMachine, selectedDate.format('YYYY-MM-DD'));
	}, [selectedDate]);

	return (
		<Box>
			<TableHeader title="Reports per Machine" />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 650 }}
				pagination={false}
				loading={
					isCreatingXReadReport ||
					isCreatingZReadReport ||
					isLoadingBranchMachines
				}
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

			<Modal
				className="Modal__hasFooter"
				title="Select Date"
				visible={datePickerModalVisible}
				onOk={onSubmitDateSelection}
				onCancel={() => {
					setSelectedBranchMachine(null);
					setDatePickerModalVisible(false);
					setDateError(null);
				}}
			>
				<Calendar
					disabledDate={(current) => current.isAfter(moment(), 'date')}
					fullscreen={false}
					defaultValue={moment()}
					onSelect={(value) => {
						setSelectedDate(value);
						setDateError(null);
					}}
				/>
				{dateError && <FieldError error={dateError} />}
			</Modal>
		</Box>
	);
};
