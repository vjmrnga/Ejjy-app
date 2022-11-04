import { Button, Popconfirm, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { RequestErrors, ViewUserModal } from 'components';
import { MAX_PAGE_SIZE, userTypes } from 'global';
import { useUserDelete, useUsers } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertIntoArray, getFullName, getUserTypeName } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	branchId: any;
	disabled: boolean;
	onEditUser: any;
	onReassignUser: any;
}

export const BranchUsers = ({
	branchId,
	disabled,
	onEditUser,
	onReassignUser,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);

	// CUSTOM HOOKS
	const {
		isFetching: isFetchingUsers,
		data: { users },
		error: listError,
	} = useUsers({
		params: {
			branchId,
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
		const formattedUsers = users
			.filter((user) => user.username !== 'dev')
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
								<Button disabled={disabled} type="primary">
									<Link to={`/office-manager/users/assign/${user.id}`}>
										Cashiering Assignments
									</Link>
								</Button>
								<Button
									disabled={disabled}
									type="primary"
									onClick={() => onReassignUser({ ...user, branchId })}
								>
									Assign Branch
								</Button>
							</>
						)}
						<Button
							disabled={disabled}
							type="primary"
							onClick={() => onEditUser({ ...user, branchId })}
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
								<Button disabled={disabled} type="primary" danger>
									Delete
								</Button>
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
					...convertIntoArray(listError),
					...convertIntoArray(deleteError?.errors),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingUsers || isDeletingUser}
				pagination={false}
				scroll={{ x: 1000 }}
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
