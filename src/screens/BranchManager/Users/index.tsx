import { DeleteOutlined, DesktopOutlined, EditFilled } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import cn from 'classnames';
import {
	BranchManagerUsersInfo,
	Content,
	ModifyUserModal,
	RequestErrors,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { DEV_USERNAME, MAX_PAGE_SIZE, userTypes } from 'global';
import { useAuth, useUserDelete, useUsers } from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
	convertIntoArray,
	getFullName,
	getLocalBranchId,
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
		data: { users },
		isFetching: isFetchingUsers,
		error: usersError,
	} = useUsers({
		params: {
			branchId: isStandAlone() ? undefined : getLocalBranchId(),
			pageSize: MAX_PAGE_SIZE,
		},
	});
	const {
		mutate: deleteUser,
		isLoading: isDeletingUser,
		error: deleteUserError,
	} = useUserDelete();

	// METHODS
	useEffect(() => {
		const data = users
			.filter((u) => {
				const isDev = u.username === DEV_USERNAME;

				const isAdminAndNotStandalone =
					u.user_type === userTypes.ADMIN && !isStandAlone();

				return !(isDev || isAdminAndNotStandalone);
			})
			.map((u) => ({
				key: u.id,
				id: u.employee_id,
				name: getFullName(u),
				type: getUserTypeName(u.user_type),
				actions: (
					<Space>
						{u.user_type !== userTypes.ADMIN && (
							<Tooltip title="Cashiering Assignment">
								<Link to={`/branch-manager/users/assign/${u.id}`}>
									<Button icon={<DesktopOutlined />} type="primary" ghost />
								</Link>
							</Tooltip>
						)}
						<Tooltip title="Edit">
							<Button
								icon={<EditFilled />}
								type="primary"
								ghost
								onClick={() => {
									setSelectedUser(u);
									setModifyUserModalVisible(true);
								}}
							>
								Edit
							</Button>
						</Tooltip>
						{u.user_type !== userTypes.ADMIN && (
							<Popconfirm
								cancelText="No"
								okText="Yes"
								placement="left"
								title="Are you sure to remove this user?"
								onConfirm={() => deleteUser(u.id)}
							>
								<Button icon={<DeleteOutlined />} type="primary" danger ghost />
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

		if (isCUDShown(user.user_type)) {
			columns.push({ title: 'Actions', dataIndex: 'actions' });
		}

		return columns;
	}, [user]);

	const handleSuccess = (addedUser) => {
		queryClient.setQueriesData<any>('useUsers', (cachedData) => {
			cachedData.data.results = [addedUser, ...cachedData.data.results];
			return cachedData;
		});
	};

	return (
		<Content title="Users">
			<BranchManagerUsersInfo />

			<Box>
				{isCUDShown(user.user_type) && (
					<TableHeader
						buttonName="Create User"
						onCreate={() => setModifyUserModalVisible(true)}
					/>
				)}

				<RequestErrors
					className={cn('px-6', {
						'mt-6': !isCUDShown(user.user_type),
					})}
					errors={[
						...convertIntoArray(usersError),
						...convertIntoArray(deleteUserError?.errors),
					]}
					withSpaceBottom
				/>

				<Table
					columns={getColumns()}
					dataSource={dataSource}
					loading={isFetchingUsers || isDeletingUser}
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
