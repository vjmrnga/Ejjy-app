import { DeleteOutlined, EditFilled } from '@ant-design/icons';
import { Button, message, Popconfirm, Space, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	ModifyBranchMachineModal,
	RequestErrors,
	TableHeader,
} from 'components';
import { useAuth, useBranchMachineDelete, useBranchMachines } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	convertIntoArray,
	getBranchMachineTypeName,
	getId,
	getUrlPrefix,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', width: 150, fixed: 'left' },
	{ title: 'Server URL', dataIndex: 'serverUrl' },
	{ title: 'Machine ID', dataIndex: 'machineID' },
	{ title: 'PTU', dataIndex: 'ptu' },
	{ title: 'Type', dataIndex: 'type' },
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
	const { user } = useAuth();
	const {
		data: { branchMachines },
		isFetching: isFetchingBranchMachines,
		error: branchMachinesError,
	} = useBranchMachines({
		params: { branchId: branch?.id },
	});
	const {
		mutateAsync: deleteBranchMachine,
		isLoading: isDeletingBranchMachine,
		error: deleteBranchMachineError,
	} = useBranchMachineDelete();

	// METHODS
	useEffect(() => {
		const formattedBranchMachines = branchMachines.map((branchMachine) => ({
			key: branchMachine.id,
			name: (
				<Link
					to={`/${getUrlPrefix(user.user_type)}/branch-machines/${
						branchMachine.id
					}`}
				>
					{branchMachine.name}
				</Link>
			),
			serverUrl: branchMachine.server_url,
			machineID: branchMachine.machine_identification_number,
			ptu: branchMachine.permit_to_use,
			type: getBranchMachineTypeName(branchMachine.type),
			actions: (
				<Space>
					<Tooltip title="Edit">
						<Button
							disabled={disabled}
							icon={<EditFilled />}
							type="primary"
							ghost
							onClick={() => {
								setSelectedBranchMachine(branchMachine);
								setModifyBranchMachineModalVisible(true);
							}}
						/>
					</Tooltip>

					<Popconfirm
						cancelText="No"
						disabled={disabled}
						okText="Yes"
						placement="left"
						title="Are you sure to remove this?"
						onConfirm={async () => {
							await deleteBranchMachine(getId(branchMachine));
							message.success('Branch machine was deleted successfully');
						}}
					>
						<Tooltip title="Remove">
							<Button icon={<DeleteOutlined />} type="primary" danger ghost />
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		}));

		setDataSource(formattedBranchMachines);
	}, [branchMachines, disabled]);

	const handleCreate = () => {
		setSelectedBranchMachine(null);
		setModifyBranchMachineModalVisible(true);
	};

	return (
		<>
			<TableHeader
				buttonName="Create Branch Machine"
				title="Branch Machines"
				wrapperClassName="pt-2 px-0"
				onCreate={handleCreate}
				onCreateDisabled={disabled}
			/>

			<RequestErrors
				errors={[
					...convertIntoArray(branchMachinesError),
					...convertIntoArray(deleteBranchMachineError?.errors),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingBranchMachines || isDeletingBranchMachine}
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
