import { Calendar, Modal, Space } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	TableHeader,
	ViewButtonIcon,
	ViewXReadReportModal,
	ViewZReadReportModal,
} from 'components';
import { Box, FieldError } from 'components/elements';
import {
	useBranchMachinePing,
	useBranchMachines,
	useXReadReportCreate,
	useZReadReportCreate,
} from 'hooks';
import { useAuth } from 'hooks/useAuth';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const columns: ColumnsType = [
	{ title: 'Machines', dataIndex: 'machines' },
	{ title: 'Connectivity Status', dataIndex: 'connectivityStatus' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const MachineReportTable = () => {
	// STATES
	const [xReadReport, setXReadReport] = useState(null);
	const [zReadReport, setZReadReport] = useState(null);
	const [dataSource, setDataSource] = useState([]);

	const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
	const [selectedBranchMachine, setSelectedBranchMachine] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [dateError, setDateError] = useState(null);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		data: { branchMachines },
		isFetching: isFetchingBranchMachines,
	} = useBranchMachines();
	const { mutate: pingBranchMachine } = useBranchMachinePing();
	const { mutateAsync: createXReadReport, isLoading: isCreatingXReadReport } =
		useXReadReportCreate();
	const { mutateAsync: createZReadReport, isLoading: isCreatingZReadReport } =
		useZReadReportCreate();

	// METHODS
	useEffect(() => {
		const formattedBranchMachines = branchMachines.map((branchMachine) => {
			pingBranchMachine({ id: branchMachine.id });

			return {
				key: branchMachine.id,
				machines: branchMachine.name,
				actions: (
					<Space>
						<ViewButtonIcon
							onClick={() => viewXReadReport(branchMachine)}
							tooltip="View XRead"
						/>

						<ViewButtonIcon
							onClick={() => {
								setSelectedBranchMachine(branchMachine);
								setDatePickerModalVisible(true);
								setSelectedDate(null);
							}}
							tooltip="View XRead (Date)"
						/>

						<ViewButtonIcon
							onClick={() => viewZReadReport(branchMachine)}
							tooltip="View ZRead"
						/>
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
					isFetchingBranchMachines
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
				onOk={() => {
					if (selectedDate.isAfter(moment(), 'day')) {
						setDateError("Date must not be after today's date.");
						return;
					}

					viewXReadReport(
						selectedBranchMachine,
						selectedDate.format('YYYY-MM-DD'),
					);
				}}
				onCancel={() => {
					setSelectedBranchMachine(null);
					setDatePickerModalVisible(false);
					setDateError(null);
				}}
			>
				<Calendar
					disabledDate={(current) => current.isAfter(moment(), 'date')}
					fullscreen={false}
					onSelect={(value) => {
						console.log('value', value);
						setSelectedDate(value);
						setDateError(null);
					}}
				/>
				{dateError && <FieldError error={dateError} />}
			</Modal>
		</Box>
	);
};
