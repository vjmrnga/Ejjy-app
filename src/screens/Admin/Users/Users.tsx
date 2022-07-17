import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, getUserTypeName, showErrorMessages } from 'utils';
import {
	Content,
	RequestErrors,
	TableActions,
	TableHeader,
} from '../../../components';
import { Box } from '../../../components/elements';
import { MAX_PAGE_SIZE } from '../../../global/constants';
import { request, userPendingApprovalTypes } from '../../../global/types';
import { useUsers } from '../../../hooks/useUsers';

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
	const [data, setData] = useState([]);

	const {
		users,
		getOnlineUsers,
		removeUser,
		approveUser,
		errors: usersErrors,
		status: usersStatus,
	} = useUsers();

	// METHODS
	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { id, first_name, last_name, user_type } = user;

			return {
				name: `${first_name} ${last_name}`,
				user_type: getUserTypeName(user_type),
				actions: (
					<TableActions
						onApprove={() => {
							approveUser(
								{
									id,
									pendingApprovalType: userPendingApprovalTypes.CREATE,
								},
								({ status, error }) => {
									if (status === request.SUCCESS) {
										fetchUsers();
									} else if (status === request.ERROR) {
										showErrorMessages(error);
									}
								},
							);
						}}
						onRemove={() => {
							removeUser(id, ({ status, error }) => {
								if (status === request.SUCCESS) {
									fetchUsers();
								} else if (status === request.ERROR) {
									showErrorMessages(error);
								}
							});
						}}
					/>
				),
			};
		});

		setData(formattedUsers);
	}, [users]);

	const fetchUsers = () => {
		getOnlineUsers(
			{
				isPendingCreateApproval: true,
				pageSize: MAX_PAGE_SIZE,
				page: 1,
			},
			true,
		);
	};

	return (
		<Box>
			<RequestErrors
				className="PaddingHorizontal"
				errors={convertIntoArray(usersErrors)}
			/>

			<TableHeader title="Pending User Creation" />
			<Table
				columns={columns}
				dataSource={data}
				loading={usersStatus === request.REQUESTING}
				pagination={false}
				scroll={{ x: 800 }}
			/>
		</Box>
	);
};

const PendingEditUserType = () => {
	// STATES
	const [data, setData] = useState([]);

	const {
		users,
		getOnlineUsers,
		removeUser,
		approveUser,
		errors: usersErrors,
		status: usersStatus,
	} = useUsers();

	// METHODS
	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { id, first_name, last_name, user_type } = user;

			return {
				name: `${first_name} ${last_name}`,
				user_type: getUserTypeName(user_type),
				actions: (
					<TableActions
						onApprove={() => {
							approveUser(
								{
									id,
									pendingApprovalType:
										userPendingApprovalTypes.UPDATE_USER_TYPE,
								},
								({ status, error }) => {
									if (status === request.SUCCESS) {
										fetchUsers();
									} else if (status === request.ERROR) {
										showErrorMessages(error);
									}
								},
							);
						}}
						onRemove={() => {
							removeUser(id, ({ status, error }) => {
								if (status === request.SUCCESS) {
									fetchUsers();
								} else if (status === request.ERROR) {
									showErrorMessages(error);
								}
							});
						}}
					/>
				),
			};
		});

		setData(formattedUsers);
	}, [users]);

	const fetchUsers = () => {
		getOnlineUsers({
			isPendingUpdateUserTypeApproval: true,
			pageSize: MAX_PAGE_SIZE,
			page: 1,
		});
	};

	return (
		<Box>
			<RequestErrors
				className="PaddingHorizontal"
				errors={convertIntoArray(usersErrors)}
			/>

			<TableHeader title="Pending User Type Update" />
			<Table
				columns={columns}
				dataSource={data}
				loading={usersStatus === request.REQUESTING}
				pagination={false}
				scroll={{ x: 800 }}
			/>
		</Box>
	);
};
