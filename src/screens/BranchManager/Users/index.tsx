import { Alert, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	Content,
	ModifyUserModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE } from 'global';
import { usePingOnlineServer, useUserDelete, useUsers } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { convertIntoArray, getFullName, getUserTypeName } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const Users = () => {
	// STATES
	const [modifyUserModalVisible, setModifyUserModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const queryClient = useQueryClient();
	const { isConnected } = usePingOnlineServer();
	const {
		isFetching: isFetchingUsers,
		data: { users },
		error: listError,
	} = useUsers({ params: { pageSize: MAX_PAGE_SIZE } });
	const {
		mutate: deleteUser,
		isLoading: isDeletingUser,
		error: deleteError,
	} = useUserDelete();

	// METHODS
	useEffect(() => {
		const formattedUsers = users.map((user) => ({
			key: user.id,
			id: user.employee_id,
			name: getFullName(user),
			type: getUserTypeName(user.user_type),
			actions: (
				<TableActions
					areButtonsDisabled={isConnected === false}
					onEdit={() => {
						setSelectedUser(user);
						setModifyUserModalVisible(true);
					}}
					onRemove={() => deleteUser(user.id)}
				/>
			),
		}));

		setDataSource(formattedUsers);
	}, [users]);

	const handleSuccess = (user) => {
		queryClient.setQueriesData<any>('useUsers', (cachedData) => {
			cachedData.data.results = [user, ...cachedData.data.results];
			return cachedData;
		});
	};

	return (
		<Content title="Users">
			{isConnected === false && (
				<Alert
					className="mb-4"
					message="Head Office Server is Offline"
					description="Create, Edit, and Delete functionalities are temporarily disabled until connection to Head Office server is restored."
					type="error"
					showIcon
				/>
			)}

			<Box>
				<TableHeader
					buttonName="Create User"
					onCreateDisabled={isConnected === false}
					onCreate={() => setModifyUserModalVisible(true)}
				/>

				<RequestErrors
					className="px-6"
					errors={[
						...convertIntoArray(listError),
						...convertIntoArray(deleteError?.errors),
					]}
					withSpaceBottom
				/>

				<Table
					columns={columns}
					dataSource={dataSource}
					scroll={{ x: 650 }}
					loading={isFetchingUsers || isDeletingUser}
					pagination={false}
				/>
			</Box>

			{modifyUserModalVisible && (
				<ModifyUserModal
					user={selectedUser}
					onSuccess={handleSuccess}
					onClose={() => {
						setSelectedUser(null);
						setModifyUserModalVisible(false);
					}}
					branchUsersOnly
				/>
			)}
		</Content>
	);
};
