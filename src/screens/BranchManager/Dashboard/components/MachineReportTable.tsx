import Table, { ColumnsType } from 'antd/lib/table';
import { TableHeader, ViewButtonIcon } from 'components';
import { Box } from 'components/elements';
import { request } from 'global';
import { useBranchMachines } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { useXreadReports } from 'hooks/useXreadReports';
import React, { useEffect, useState } from 'react';
import { showErrorMessages } from 'utils/function';
import { ViewReportModal } from './ViewReportModal';

const columns: ColumnsType = [
	{ title: 'Machines', dataIndex: 'machines', key: 'machines' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

export const MachineReportTable = () => {
	// STATES
	const [viewReportModalVisible, setViewReportModalVisible] = useState(false);
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		data: { branchMachines },
		isFetching: isFetchingBranchMachines,
	} = useBranchMachines();
	const {
		xreadReport,
		createXreadReport,
		status: xReadReportStatus,
	} = useXreadReports();

	// METHODS

	useEffect(() => {
		setData(
			branchMachines.map(({ name, id }) => ({
				machines: name,
				actions: (
					<ViewButtonIcon
						onClick={() => viewReport(id)}
						tooltip="View Report"
					/>
				),
			})),
		);
	}, [branchMachines]);

	const viewReport = (machineId) => {
		createXreadReport(
			{
				branchId: user?.branch?.id,
				userId: user.id,
				branchMachineId: machineId,
			},
			({ status, errors }) => {
				if (status === request.ERROR) {
					showErrorMessages(errors);
				} else if (status === request.SUCCESS) {
					setViewReportModalVisible(true);
				}
			},
		);
	};

	return (
		<Box>
			<TableHeader title="Reports per Machine" />

			<Table
				columns={columns}
				dataSource={data}
				scroll={{ x: 650 }}
				pagination={false}
				loading={
					xReadReportStatus === request.REQUESTING || isFetchingBranchMachines
				}
			/>

			<ViewReportModal
				visible={viewReportModalVisible}
				report={xreadReport}
				onClose={() => setViewReportModalVisible(false)}
			/>
		</Box>
	);
};
