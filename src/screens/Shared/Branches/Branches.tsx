import { Alert, message } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	Content,
	ModifyBranchModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { useBranchDelete, useBranches, usePingOnlineServer } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertIntoArray } from 'utils';
import './style.scss';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', width: 150, fixed: 'left' },
	{ title: 'Online URL', dataIndex: 'url' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const Branches = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [modifyBranchModalVisible, setModifyBranchModalVisible] =
		useState(false);
	const [selectedBranch, setSelectedBranch] = useState(null);

	// CUSTOM HOOKS
	const { isConnected } = usePingOnlineServer();
	const {
		data: { branches },
		isFetching: isFetchingBranches,
		error: listError,
	} = useBranches();
	const {
		mutate: deleteBranch,
		isLoading: isDeletingBranch,
		error: deleteError,
	} = useBranchDelete();

	// METHODS
	useEffect(() => {
		const formattedBranches = branches.map((branch) => ({
			name: <Link to={`branches/${branch.id}`}>{branch.name}</Link>,
			url: branch.online_url,
			actions: (
				<TableActions
					areButtonsDisabled={isConnected === false}
					onEdit={() => {
						setSelectedBranch(branch);
						setModifyBranchModalVisible(true);
					}}
					onRemove={() => {
						message.success('Branch was deleted successfully');
						deleteBranch(branch.id);
					}}
				/>
			),
		}));

		setDataSource(formattedBranches);
	}, [branches, isConnected]);

	return (
		<Content className="Branches" title="Branches">
			{isConnected === false && (
				<Alert
					className="mb-4"
					message="Online Server cannot be reached."
					description="Create, Edit, and Delete functionalities are temporarily disabled until connection to Online Server is restored."
					type="error"
					showIcon
				/>
			)}

			<Box>
				<TableHeader
					buttonName="Create Branch"
					onCreateDisabled={isConnected === false}
					onCreate={() => setModifyBranchModalVisible(true)}
				/>

				<RequestErrors
					errors={[
						...convertIntoArray(listError),
						...convertIntoArray(deleteError?.errors),
					]}
				/>

				<Table
					columns={columns}
					dataSource={dataSource}
					scroll={{ x: 650 }}
					pagination={false}
					loading={isFetchingBranches || isDeletingBranch}
				/>

				{modifyBranchModalVisible && (
					<ModifyBranchModal
						branch={selectedBranch}
						onClose={() => {
							setSelectedBranch(null);
							setModifyBranchModalVisible(false);
						}}
					/>
				)}
			</Box>
		</Content>
	);
};
