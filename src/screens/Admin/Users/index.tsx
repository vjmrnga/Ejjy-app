import { message } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { Content, RequestErrors, TableActions, TableHeader } from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE, serviceTypes, userPendingApprovalTypes } from 'global';
import { useUserApprove, useUserDelete, useUsers } from 'hooks';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	getFullName,
	getGoogleApiUrl,
	getUserTypeName,
} from 'utils';

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
		params: {
			isPendingCreateApproval: true,
			pageSize: MAX_PAGE_SIZE,
			serviceType: serviceTypes.ONLINE,
			serverUrl: getGoogleApiUrl(),
		},
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
			const { id, user_type } = user;

			return {
				key: id,
				name: getFullName(user),
				userType: getUserTypeName(user_type),
				actions: (
					<TableActions
						onApprove={async () => {
							await approveUser({
								id,
								pendingApprovalType: userPendingApprovalTypes.CREATE,
							});

							message.success("User's creation was approved successfully");
						}}
						onRemove={async () => {
							await deleteUser(id);

							message.success("User's creation was declined successfully");
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
		params: {
			isPendingUpdateUserTypeApproval: true,
			pageSize: MAX_PAGE_SIZE,
			serviceType: serviceTypes.ONLINE,
			serverUrl: getGoogleApiUrl(),
		},
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
			const { id, user_type } = user;

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

							message.success(
								"User's type change request was updated successfully",
							);
						}}
						onRemove={async () => {
							await deleteUser(id);

							message.success(
								"User's type change request was declined successfully",
							);
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
