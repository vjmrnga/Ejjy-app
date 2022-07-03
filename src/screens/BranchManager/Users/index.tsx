import { Table } from 'antd';
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
import { useAuth, useUserDelete, useUsers } from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import {
	convertIntoArray,
	getBranchId,
	getFullName,
	getUserTypeName,
	isCUDShown,
	isStandAlone,
} from 'utils';

export const Users = () => {
	// STATES
	const [modifyUserModalVisible, setModifyUserModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const {
		isFetching: isFetchingUsers,
		data: { users },
		error: listError,
	} = useUsers({
		params: {
			branchId: isStandAlone() ? undefined : getBranchId(),
			pageSize: MAX_PAGE_SIZE,
		},
	});
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

	const getColumns = useCallback(() => {
		const columns: ColumnsType = [
			{ title: 'ID', dataIndex: 'id' },
			{ title: 'Name', dataIndex: 'name' },
			{ title: 'Type', dataIndex: 'type' },
		];

		if (isCUDShown(user.user_type)) {
			columns.push({ title: 'Actions', dataIndex: 'actions' });
		}

		return columns;
	}, [user]);

	const handleSuccess = (user) => {
		queryClient.setQueriesData<any>('useUsers', (cachedData) => {
			cachedData.data.results = [user, ...cachedData.data.results];
			return cachedData;
		});
	};

	return (
		<Content title="Users">
			<Box>
				{isCUDShown(user.user_type) && (
					<TableHeader
						buttonName="Create User"
						onCreate={() => setModifyUserModalVisible(true)}
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
