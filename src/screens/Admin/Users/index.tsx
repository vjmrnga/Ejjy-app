import Table, { ColumnsType } from 'antd/lib/table';
import { Content, RequestErrors, TableActions, TableHeader } from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE, userPendingApprovalTypes } from 'global';
import { useUserApprove, useUserDelete, useUsers } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, getFullName, getUserTypeName } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'User Type', dataIndex: 'user_type', key: 'user_type' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
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
		isFetching: isUsersFetching,
		error: userError,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
	});
	const {
		mutateAsync: approveUser,
		isLoading: isApproving,
		error: approveError,
	} = useUserApprove();
	const {
		mutate: deleteUser,
		isLoading: isDeletingUser,
		error: deleteError,
	} = useUserDelete();

	// METHODS
	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { id, user_type } = user;

			return {
				key: id,
				name: getFullName(user),
				user_type: getUserTypeName(user_type),
				actions: (
					<TableActions
						onApprove={async () => {
							await approveUser({
								id,
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
				className="PaddingHorizontal"
				errors={[
					...convertIntoArray(userError),
					...convertIntoArray(approveError?.errors),
					...convertIntoArray(deleteError?.errors),
				]}
			/>

			<TableHeader title="Pending User Creation" />
			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isUsersFetching || isApproving || isDeletingUser}
				pagination={false}
				scroll={{ x: 800 }}
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
		isFetching: isUsersFetching,
		error: userError,
	} = useUsers({
		params: { isPendingUpdateUserTypeApproval: true, pageSize: MAX_PAGE_SIZE },
	});
	const {
		mutateAsync: approveUser,
		isLoading: isApproving,
		error: approveError,
	} = useUserApprove();
	const {
		mutate: deleteUser,
		isLoading: isDeletingUser,
		error: deleteError,
	} = useUserDelete();

	// METHODS
	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { id, user_type } = user;

			return {
				key: id,
				name: getFullName(user),
				user_type: getUserTypeName(user_type),
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
				className="PaddingHorizontal"
				errors={[
					...convertIntoArray(userError),
					...convertIntoArray(approveError?.errors),
					...convertIntoArray(deleteError?.errors),
				]}
			/>

			<TableHeader title="Pending User Type Update" />
			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isUsersFetching || isApproving || isDeletingUser}
				pagination={false}
				scroll={{ x: 800 }}
			/>
		</Box>
	);
};
