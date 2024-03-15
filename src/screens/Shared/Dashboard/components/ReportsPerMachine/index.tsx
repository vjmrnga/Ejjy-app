import { Button, Space, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	ReportTimeRangeModal,
	RequestErrors,
	TableHeader,
	ViewXReadReportsModal,
	ViewZReadReportsModal,
} from 'components';
import { MAX_PAGE_SIZE, branchMachineTypes, readReportTypes } from 'global';
import { useBranchMachines } from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import { convertIntoArray, isUserFromBranch } from 'utils';

interface Props {
	branchId: string | number;
	tableHeaderClassName?: string;
}

const branchMachineCashieringTypes = [
	branchMachineTypes.CASHIERING,
	branchMachineTypes.SCALE_AND_CASHIERING,
];

const BRANCH_MACHINES_REFETCH_INTERVAL_MS = 2500;

export const ReportsPerMachine = ({
	branchId,
	tableHeaderClassName,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBranchMachine, setSelectedBranchMachine] = useState(null);
	const [selectedReadReportType, setSelectedReadReportType] = useState(null);
	const [
		isExportEjournalModalVisible,
		setIsExportEjournalModalVisible,
	] = useState(false);

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
							setSelectedReadReportType(readReportTypes.XREAD);
						}}
					>
						View X-read Reports
					</Button>
					<Button
						type="primary"
						onClick={() => {
							setSelectedBranchMachine(branchMachine);
							setSelectedReadReportType(readReportTypes.ZREAD);
						}}
					>
						View Z-read Reports
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

	return (
		<>
			<TableHeader
				title="Reports per Machine"
				wrapperClassName={tableHeaderClassName}
			/>

			<RequestErrors
				className="px-6"
				errors={convertIntoArray(branchMachinesError)}
				withSpaceBottom
			/>

			<Table
				columns={getColumns()}
				dataSource={dataSource}
				loading={isFetchingBranchMachines && !isBranchMachinesFetchedAfterMount}
				pagination={false}
				scroll={{ x: 650 }}
				bordered
			/>

			{isExportEjournalModalVisible && (
				<ReportTimeRangeModal
					onClose={() => setIsExportEjournalModalVisible(null)}
				/>
			)}

			{selectedBranchMachine &&
				readReportTypes.XREAD === selectedReadReportType && (
					<ViewXReadReportsModal
						branchMachine={selectedBranchMachine}
						onClose={() => {
							setSelectedBranchMachine(null);
							setSelectedReadReportType(null);
						}}
					/>
				)}

			{selectedBranchMachine &&
				readReportTypes.ZREAD === selectedReadReportType && (
					<ViewZReadReportsModal
						branchMachine={selectedBranchMachine}
						onClose={() => {
							setSelectedBranchMachine(null);
							setSelectedReadReportType(null);
						}}
					/>
				)}
		</>
	);
};
