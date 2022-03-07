import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Content,
	RequestErrors,
	TableActions,
	TableHeader,
} from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { useBranchMachines } from '../../../hooks/useBranchMachines';
import { convertIntoArray } from '../../../utils/function';
import { ModifyBranchMachineModal } from './components/ModifyBranchMachineModal';

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
	const { branchMachines, getBranchMachines, status, errors } =
		useBranchMachines();

	// METHODS
	useEffect(() => {
		getBranchMachines();
	}, []);

	// Effect: Format branch machines to be rendered in Table
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
		<Content className="BranchMachines" title="Branch Machines">
			<Box>
				<TableHeader buttonName="Create Branch Machine" onCreate={onCreate} />

				<RequestErrors errors={convertIntoArray(errors)} />

				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 800 }}
					loading={status === request.REQUESTING}
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
