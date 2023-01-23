import Table, { ColumnsType } from 'antd/lib/table';
import { Content, RequestErrors, TableActions, TableHeader } from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE, userPendingApprovalTypes } from 'global';
import { useUserApprove, useUserDelete, useUsers } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, getFullName, getId, getUserTypeName } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'User Type', dataIndex: 'userType' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const Users = () => (
	<Content className="Users" title="Users">
		<PendingUserCreation />
		<PendingEditUserType />
	</Content>
);

const PendingUserCreation = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: userError,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
	});
	const {
		mutateAsync: approveUser,
		isLoading: isApprovingUser,
		error: approveUserError,
	} = useUserApprove();
	const {
		mutate: deleteUser,
		isLoading: isDeletingUser,
		error: deleteUserError,
	} = useUserDelete();

	// METHODS
	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { user_type } = user;

			const id = getId(user);

			return {
				key: id,
				name: getFullName(user),
				userType: getUserTypeName(user_type),
				actions: (
					<TableActions
						onApprove={async () => {
							await approveUser({
								id: getId(user),
								pendingApprovalType: userPendingApprovalTypes.CREATE,
							});
						}}
						onRemove={async () => {
							await deleteUser(id);
						}}
					/>
				),
			};
		});

		setDataSource(formattedUsers);
	}, [users]);

	return (
		<Box>
			<RequestErrors
				className="px-6"
				errors={[
					...convertIntoArray(userError),
					...convertIntoArray(approveUserError?.errors),
					...convertIntoArray(deleteUserError?.errors),
				]}
			/>

			<TableHeader title="Pending User Creation" />
			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingUsers || isApprovingUser || isDeletingUser}
				pagination={false}
				scroll={{ x: 800 }}
				bordered
			/>
		</Box>
	);
};

const PendingEditUserType = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: userError,
	} = useUsers({
		params: { isPendingUpdateUserTypeApproval: true, pageSize: MAX_PAGE_SIZE },
	});
	const {
		mutateAsync: approveUser,
		isLoading: isApprovingUser,
		error: approveUserError,
	} = useUserApprove();
	const {
		mutate: deleteUser,
		isLoading: isDeletingUser,
		error: deleteUserError,
	} = useUserDelete();

	// METHODS
	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { user_type } = user;

			const id = getId(user);

			return {
				key: id,
				name: getFullName(user),
				userType: getUserTypeName(user_type),
				actions: (
					<TableActions
						onApprove={async () => {
							await approveUser({
								id,
								pendingApprovalType: userPendingApprovalTypes.UPDATE_USER_TYPE,
							});
						}}
						onRemove={async () => {
							await deleteUser(id);
						}}
					/>
				),
			};
		});

		setDataSource(formattedUsers);
	}, [users]);

	return (
		<Box>
			<RequestErrors
				className="px-6"
				errors={[
					...convertIntoArray(userError),
					...convertIntoArray(approveUserError?.errors),
					...convertIntoArray(deleteUserError?.errors),
				]}
			/>

			<TableHeader title="Pending User Type Update" />
			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingUsers || isApprovingUser || isDeletingUser}
				pagination={false}
				scroll={{ x: 800 }}
				bordered
			/>
		</Box>
	);
};
