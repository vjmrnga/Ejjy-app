import { Button, Popconfirm, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	Content,
	ModifyUserModal,
	RequestErrors,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE, userTypes } from 'global';
import { useAuth, useUserDelete, useUsers } from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
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
	const history = useHistory();
	const { user: currentUser } = useAuth();
	const {
		data: { users },
		error: usersError,
		isFetching: isUsersFetching,
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
		const data = users
			.filter(
				(user) =>
					!(user.username === 'dev' || user.user_type === userTypes.ADMIN),
			)
			.map((user) => ({
				key: user.id,
				id: user.employee_id,
				name: getFullName(user),
				type: getUserTypeName(user.user_type),
				actions: (
					<Space>
						{user.user_type !== userTypes.ADMIN && (
							<Button
								type="primary"
								onClick={() =>
									history.push(`/branch-manager/users/assign/${user.id}`)
								}
							>
								Cashiering Assignments
							</Button>
						)}
						<Button
							type="primary"
							onClick={() => {
								setSelectedUser(user);
								setModifyUserModalVisible(true);
							}}
						>
							Edit
						</Button>
						{user.user_type !== userTypes.ADMIN && (
							<Popconfirm
								cancelText="No"
								okText="Yes"
								placement="left"
								title="Are you sure to remove this user?"
								onConfirm={() => deleteUser(user.id)}
							>
								<Button type="primary" danger>
									Delete
								</Button>
							</Popconfirm>
						)}
					</Space>
				),
			}));

		setDataSource(data);
	}, [users]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType = [
			{ title: 'ID', dataIndex: 'id' },
			{ title: 'Name', dataIndex: 'name' },
			{ title: 'Type', dataIndex: 'type' },
		];

		if (isCUDShown(currentUser.user_type)) {
			columns.push({ title: 'Actions', dataIndex: 'actions' });
		}

		return columns;
	}, [currentUser]);

	const handleSuccess = (addedUser) => {
		queryClient.setQueriesData<any>('useUsers', (cachedData) => {
			cachedData.data.results = [addedUser, ...cachedData.data.results];
			return cachedData;
		});
	};

	return (
		<Content title="Users">
			<Box>
				{isCUDShown(currentUser.user_type) && (
					<TableHeader
						buttonName="Create User"
						onCreate={() => setModifyUserModalVisible(true)}
					/>
				)}

				<RequestErrors
					className="px-4"
					errors={[
						...convertIntoArray(usersError),
						...convertIntoArray(deleteError?.errors),
					]}
					withSpaceBottom
				/>

				<Table
					columns={getColumns()}
					dataSource={dataSource}
					loading={isUsersFetching || isDeletingUser}
					pagination={false}
					scroll={{ x: 650 }}
				/>
			</Box>

			{modifyUserModalVisible && (
				<ModifyUserModal
					user={selectedUser}
					branchUsersOnly
					onClose={() => {
						setSelectedUser(null);
						setModifyUserModalVisible(false);
					}}
					onSuccess={handleSuccess}
				/>
			)}
		</Content>
	);
};
