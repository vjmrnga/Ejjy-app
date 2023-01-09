import { message } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	ModifyBranchMachineModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from 'components';
import { useBranchMachineDelete, useBranchMachines } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, getId } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', width: 150, fixed: 'left' },
	{ title: 'Server URL', dataIndex: 'serverUrl' },
	{ title: 'Machine ID', dataIndex: 'machineID' },
	{ title: 'PTU', dataIndex: 'ptu' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	branch: any;
	disabled: boolean;
}

export const TabBranchMachines = ({ branch, disabled }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBranchMachine, setSelectedBranchMachine] = useState(null);
	const [modifyBranchMachineModalVisible, setModifyBranchMachineModalVisible] =
		useState(false);

	// CUSTOM HOOKS
	const {
		data: { branchMachines },
		isFetching,
		error: listError,
	} = useBranchMachines({
		params: {
			branchId: branch?.id,
		},
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
			name: branchMachine.name,
			serverUrl: branchMachine.server_url,
			machineID: branchMachine.machine_identification_number,
			ptu: branchMachine.permit_to_use,
			actions: (
				<TableActions
					areButtonsDisabled={disabled}
					onEdit={() => handleEdit(branchMachine)}
					onRemove={() => {
						message.success('Branch machine was deleted successfully');
						deleteBranchMachine(getId(branchMachine));
					}}
				/>
			),
		}));

		setDataSource(formattedBranchMachines);
	}, [branchMachines, disabled]);

	const handleCreate = () => {
		setSelectedBranchMachine(null);
		setModifyBranchMachineModalVisible(true);
	};

	const handleEdit = (branchMachine) => {
		setSelectedBranchMachine(branchMachine);
		setModifyBranchMachineModalVisible(true);
	};

	return (
		<>
			<TableHeader
				buttonName="Create Branch Machine"
				title="Branch Machines"
				wrapperClassName="pt-0"
				onCreate={handleCreate}
				onCreateDisabled={disabled}
			/>

			<RequestErrors
				errors={[
					...convertIntoArray(listError),
					...convertIntoArray(deleteError?.errors),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetching || isLoading}
				pagination={false}
				scroll={{ x: 800 }}
				bordered
			/>

			{modifyBranchMachineModalVisible && (
				<ModifyBranchMachineModal
					branchId={getId(branch)}
					branchMachine={selectedBranchMachine}
					onClose={() => setModifyBranchMachineModalVisible(false)}
				/>
			)}
		</>
	);
};
