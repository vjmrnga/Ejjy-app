import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Content, RequestErrors, TableActions } from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { useUsers } from '../../../hooks/useUsers';
import {
	convertIntoArray,
	getUserTypeName,
	showErrorMessages,
} from '../../../utils/function';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'User Type', dataIndex: 'user_type', key: 'user_type' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

export const Users = () => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
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

	// Effect: Format users to be rendered in Table
	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { id, first_name, last_name, user_type } = user;

			return {
				name: `${first_name} ${last_name}`,
				user_type: getUserTypeName(user_type),
				actions: (
					<TableActions
						onApprove={() => {
							approveUser(id, ({ status, error }) => {
								if (status === request.SUCCESS) {
									fetchUsers();
								} else if (status === request.ERROR) {
									showErrorMessages(error);
								}
							});
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
			isPendingApproval: true,
		});
	};

	return (
		<Content className="Users" title="Users">
			<Box>
				<RequestErrors errors={convertIntoArray(usersErrors)} />

				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 800 }}
					pagination={false}
					loading={usersStatus === request.REQUESTING}
				/>
			</Box>
		</Content>
	);
};
