import { Button, Space, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	ReportTimeRangeModal,
	RequestErrors,
	TableHeader,
	ViewXReportsModal,
	ViewZReportsModal,
} from 'components';
import { readReportTypes, reportCategories, ReportCategory } from 'ejjy-global';
import { branchMachineTypes, MAX_PAGE_SIZE } from 'global';
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
	const [selectedReadReportType, setSelectedReadReportType] = useState<
		string | null
	>(null);
	const [
		selectedReportCategory,
		setSelectedReportCategory,
	] = useState<ReportCategory | null>(null);
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
		const formattedBranchMachines = branchMachines.map((branchMachine) => {
			const isCashiering = branchMachineCashieringTypes.includes(
				branchMachine.type,
			);

			return {
				key: branchMachine.id,
				machine: branchMachine.name,
				connectivityStatus: branchMachine.is_online ? (
					<Tag color="green">Online</Tag>
				) : (
					<Tag color="red">Offline</Tag>
				),
				actions: isCashiering && (
					<Space>
						<Button
							type="primary"
							onClick={() => {
								setSelectedBranchMachine(branchMachine);
								setSelectedReadReportType(readReportTypes.XREAD);
								setSelectedReportCategory(reportCategories.EJournals);
							}}
						>
							View X-read Reports
						</Button>
						<Button
							type="primary"
							onClick={() => {
								setSelectedBranchMachine(branchMachine);
								setSelectedReadReportType(readReportTypes.ZREAD);
								setSelectedReportCategory(reportCategories.EJournals);
							}}
						>
							View Z-read Reports
						</Button>
					</Space>
				),
			};
		});

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

	const handleClose = () => {
		setSelectedBranchMachine(null);
		setSelectedReadReportType(null);
		setSelectedReportCategory(null);
	};

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
				selectedReportCategory &&
				readReportTypes.XREAD === selectedReadReportType && (
					<ViewXReportsModal
						branchMachine={selectedBranchMachine}
						category={selectedReportCategory}
						onClose={handleClose}
					/>
				)}

			{selectedBranchMachine &&
				selectedReportCategory &&
				readReportTypes.ZREAD === selectedReadReportType && (
					<ViewZReportsModal
						branchMachine={selectedBranchMachine}
						category={selectedReportCategory}
						onClose={handleClose}
					/>
				)}
		</>
	);
};
