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
import { convertIntoArray } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', key: 'name', width: 150, fixed: 'left' },
	{ title: 'Server URL', dataIndex: 'server_url', key: 'server_url' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

export const BranchMachines = () => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedBranchMachine, setSelectedBranchMachine] = useState(null);
	const [modifyBranchMachineModalVisible, setModifyBranchMachineModalVisible] =
		useState(false);

	// CUSTOM HOOKS
	const {
		data: { branchMachines },
		isFetching,
		error,
	} = useBranchMachines();

	// METHODS
	useEffect(() => {
		const formattedBranchMachines = branchMachines.map((branchMachine) => ({
			key: branchMachine.id,
			name: (
				<Link to={`/branch-manager/branch-machines/${branchMachine.id}`}>
					{branchMachine.name}
				</Link>
			),
			server_url: branchMachine.server_url,
			actions: <TableActions onEdit={() => onEdit(branchMachine)} />,
		}));

		setData(formattedBranchMachines);
	}, [branchMachines]);

	const onCreate = () => {
		setSelectedBranchMachine(null);
		setModifyBranchMachineModalVisible(true);
	};

	const onEdit = (branchMachine) => {
		setSelectedBranchMachine(branchMachine);
		setModifyBranchMachineModalVisible(true);
	};

	return (
		<Content title="Branch Machines">
			<Box>
				<TableHeader buttonName="Create Branch Machine" onCreate={onCreate} />

				<RequestErrors errors={convertIntoArray(error)} />

				<Table
					columns={columns}
					dataSource={data}
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
