import { message } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	BranchesInfo,
	ConnectionAlert,
	Content,
	ModifyBranchModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE } from 'global';
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
	} = useBranches({
		params: {
			pageSize: MAX_PAGE_SIZE,
		},
	});
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
			<ConnectionAlert />

			<BranchesInfo />

			<Box>
				<TableHeader
					buttonName="Create Branch"
					onCreate={() => setModifyBranchModalVisible(true)}
					onCreateDisabled={isConnected === false}
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
					loading={isFetchingBranches || isDeletingBranch}
					pagination={false}
					scroll={{ x: 650 }}
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
