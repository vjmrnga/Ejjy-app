import { message } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	BranchMachinesInfo,
	Content,
	ModifyBranchMachineModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { useAuth, useBranchMachineDelete, useBranchMachines } from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertIntoArray, getLocalBranchId, isCUDShown } from 'utils';

export const BranchMachines = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBranchMachine, setSelectedBranchMachine] = useState(null);
	const [modifyBranchMachineModalVisible, setModifyBranchMachineModalVisible] =
		useState(false);

	// VARIABLES
	const branchId = getLocalBranchId();

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		data: { branchMachines },
		isFetching,
		error: listError,
	} = useBranchMachines({
		params: { branchId },
	});
	const {
		mutate: deleteBranchMachine,
		isLoading,
		error: deleteError,
	} = useBranchMachineDelete();

	// METHODS
	useEffect(() => {
		const formattedBranchMachines = branchMachines.map((branchMachine) => ({
			key: branchMachine.id,
			name: (
				<Link to={`/branch-manager/branch-machines/${branchMachine.id}`}>
					{branchMachine.name}
				</Link>
			),
			serverUrl: branchMachine.server_url,
			machineID: branchMachine.machine_identification_number,
			ptu: branchMachine.permit_to_use,
			actions: (
				<TableActions
					onEdit={() => handleEdit(branchMachine)}
					onRemove={() => {
						message.success('Branch machine was deleted successfully');
						deleteBranchMachine(branchMachine.id);
					}}
				/>
			),
		}));

		setDataSource(formattedBranchMachines);
	}, [branchMachines]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType = [
			{ title: 'Name', dataIndex: 'name', width: 150, fixed: 'left' },
			{ title: 'Server URL', dataIndex: 'serverUrl' },
			{ title: 'Machine ID', dataIndex: 'machineID' },
			{ title: 'PTU', dataIndex: 'ptu' },
		];

		if (isCUDShown(user.user_type)) {
			columns.push({ title: 'Actions', dataIndex: 'actions' });
		}

		return columns;
	}, [user]);

	const handleCreate = () => {
		setSelectedBranchMachine(null);
		setModifyBranchMachineModalVisible(true);
	};

	const handleEdit = (branchMachine) => {
		setSelectedBranchMachine(branchMachine);
		setModifyBranchMachineModalVisible(true);
	};

	return (
		<Content title="Branch Machines">
			<BranchMachinesInfo />

			<Box>
				{isCUDShown(user.user_type) && (
					<TableHeader
						buttonName="Create Branch Machine"
						onCreate={handleCreate}
					/>
				)}

				<RequestErrors
					className="px-4"
					errors={[
						...convertIntoArray(listError),
						...convertIntoArray(deleteError?.errors),
					]}
					withSpaceBottom
				/>

				<Table
					columns={getColumns()}
					dataSource={dataSource}
					loading={isFetching || isLoading}
					pagination={false}
					scroll={{ x: 800 }}
				/>
			</Box>

			{modifyBranchMachineModalVisible && (
				<ModifyBranchMachineModal
					branchId={branchId}
					branchMachine={selectedBranchMachine}
					onClose={() => setModifyBranchMachineModalVisible(false)}
				/>
			)}
		</Content>
	);
};
