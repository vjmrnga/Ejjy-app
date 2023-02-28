import {
	DeleteOutlined,
	DesktopOutlined,
	EditFilled,
	SelectOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { RequestErrors, ViewUserModal } from 'components';
import { DEV_USERNAME, MAX_PAGE_SIZE, userTypes } from 'global';
import { useUserRequestUserDeletion, useUsers } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { convertIntoArray, getFullName, getId, getUserTypeName } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	branch: any;
	disabled: boolean;
	isFetchUsersEnabled: boolean;
	onEditUser: any;
	onReassignUser: any;
}

export const BranchUsers = ({
	branch,
	disabled,
	isFetchUsersEnabled,
	onEditUser,
	onReassignUser,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);

	// CUSTOM HOOKS
	const queryClient = useQueryClient();
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: usersError,
	} = useUsers({
		params: {
			branchId: branch.id,
			isPendingCreateApproval: false,
			isPendingUpdateUserTypeApproval: false,
			isPendingDeleteApproval: false,
			pageSize: MAX_PAGE_SIZE,
		},
		options: {
			enabled: isFetchUsersEnabled,
		},
	});
	const {
		mutateAsync: requestUserDeletion,
		isLoading: isRequestingUserDeletion,
		error: requestUserDeletionError,
	} = useUserRequestUserDeletion();

	// METHODS
	useEffect(() => {
		const formattedUsers = users
			.filter((user) => user.username !== DEV_USERNAME)
			.map((user) => ({
				key: user.id,
				id: (
					<Button
						className="pa-0"
						type="link"
						onClick={() => setSelectedUser(user)}
					>
						{user.employee_id}
					</Button>
				),
				name: getFullName(user),
				type: getUserTypeName(user.user_type),
				actions: (
					<Space>
						{user.user_type !== userTypes.ADMIN && (
							<>
								<Tooltip title="Cashiering Assignment">
									<Link to={`/office-manager/users/assign/${user.id}`}>
										<Button
											disabled={disabled}
											icon={<DesktopOutlined />}
											type="primary"
											ghost
										/>
									</Link>
								</Tooltip>

								<Tooltip title="Assign Branch">
									<Button
										disabled={disabled}
										icon={<SelectOutlined />}
										type="primary"
										ghost
										onClick={() =>
											onReassignUser({
												...user,
												branchId: getId(branch),
											})
										}
									/>
								</Tooltip>
							</>
						)}

						<Tooltip title="Edit">
							<Button
								disabled={disabled}
								icon={<EditFilled />}
								type="primary"
								ghost
								onClick={() =>
									onEditUser({
										...user,
										branchId: getId(branch),
									})
								}
							/>
						</Tooltip>

						{user.user_type !== userTypes.ADMIN && (
							<Popconfirm
								cancelText="No"
								okText="Yes"
								placement="left"
								title="Are you sure to remove this user?"
								onConfirm={async () => {
									await requestUserDeletion(getId(user));
									queryClient.invalidateQueries('useUserPendingApprovals');
								}}
							>
								<Tooltip title="Remove">
									<Button
										disabled={disabled}
										icon={<DeleteOutlined />}
										type="primary"
										danger
										ghost
									/>
								</Tooltip>
							</Popconfirm>
						)}
					</Space>
				),
			}));

		setDataSource(formattedUsers);
	}, [users, disabled]);

	return (
		<>
			<RequestErrors
				errors={[
					...convertIntoArray(usersError),
					...convertIntoArray(requestUserDeletionError?.errors),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingUsers || isRequestingUserDeletion}
				pagination={false}
				scroll={{ x: 1000 }}
				bordered
			/>

			{selectedUser && (
				<ViewUserModal
					user={selectedUser}
					onClose={() => setSelectedUser(null)}
				/>
			)}
		</>
	);
};
