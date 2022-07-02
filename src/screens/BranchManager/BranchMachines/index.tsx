import Table, { ColumnsType } from 'antd/lib/table';
import { Content, RequestErrors, TableHeader } from 'components';
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
];

export const BranchMachines = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

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
		}));

		setDataSource(formattedBranchMachines);
	}, [branchMachines]);

	return (
		<Content title="Branch Machines">
			<Box>
				<TableHeader buttonName="Create Branch Machine" />

				<RequestErrors errors={convertIntoArray(error)} />

				<Table
					columns={columns}
					dataSource={dataSource}
					scroll={{ x: 800 }}
					loading={isFetching}
					pagination={false}
				/>
			</Box>
		</Content>
	);
};
