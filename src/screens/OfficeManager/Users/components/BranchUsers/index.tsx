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
import { useUserDelete, useUsers } from 'hooks';
import React, { useEffect, useState } from 'react';
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
	onEditUser: any;
	onReassignUser: any;
}

export const BranchUsers = ({
	branch,
	disabled,
	onEditUser,
	onReassignUser,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);

	// CUSTOM HOOKS
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: usersError,
	} = useUsers({
		params: {
			branchId: branch.id,
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
								onConfirm={() => deleteUser(getId(user))}
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
					...convertIntoArray(deleteUserError?.errors),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingUsers || isDeletingUser}
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
