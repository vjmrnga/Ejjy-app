import Table, { ColumnsType } from 'antd/lib/table';
import {
	Content,
	ModifyBranchMachineModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { useBranchMachines } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertIntoArray, getBranchId } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', width: 150, fixed: 'left' },
	{ title: 'Server URL', dataIndex: 'serverUrl' },
	{ title: 'Machine ID', dataIndex: 'machineID' },
	{ title: 'PTU', dataIndex: 'ptu' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const BranchMachines = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBranchMachine, setSelectedBranchMachine] = useState(null);
	const [modifyBranchMachineModalVisible, setModifyBranchMachineModalVisible] =
		useState(false);

	// CUSTOM HOOKS
	const {
		data: { branchMachines },
		isFetching,
		error,
	} = useBranchMachines({
		params: {
			branchId: getBranchId(),
		},
	});

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
			actions: <TableActions onEdit={() => handleEdit(branchMachine)} />,
		}));

		setDataSource(formattedBranchMachines);
	}, [branchMachines]);

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
			<Box>
				<TableHeader
					buttonName="Create Branch Machine"
					onCreate={handleCreate}
				/>

				<RequestErrors errors={convertIntoArray(error)} />

				<Table
					columns={columns}
					dataSource={dataSource}
					scroll={{ x: 800 }}
					loading={isFetching}
					pagination={false}
				/>

				{modifyBranchMachineModalVisible && (
					<ModifyBranchMachineModal
						branchMachine={selectedBranchMachine}
						onClose={() => setModifyBranchMachineModalVisible(false)}
					/>
				)}
			</Box>
		</Content>
	);
};
