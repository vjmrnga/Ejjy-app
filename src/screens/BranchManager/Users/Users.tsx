import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	Content,
	CreateUserModal,
	TableActions,
	TableHeader,
} from '../../../components';
import { Box } from '../../../components/elements';
import { MAX_PAGE_SIZE } from '../../../global/constants';
import { request } from '../../../global/types';
import { useUsers } from '../../../hooks/useUsers';
import { getUserTypeName } from '../../../utils/function';
import { BranchUsers } from '../../OfficeManager/Users/components/BranchUsers';
import './style.scss';

export const Users = () => {
	// STATES
	const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const history = useHistory();
	const { users, getUsers, status: usersStatus } = useUsers();

	// METHODS
	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { id, first_name, last_name, user_type, employee_id } = user;

			return {
				key: id,
				id: employee_id,
				name: `${first_name} ${last_name}`,
				type: getUserTypeName(user_type),
				action: (
					<TableActions
						onAssign={() => history.push(`/branch-manager/users/assign/${id}`)}
					/>
				),
			};
		});

		setDataSource(formattedUsers);
	}, [users]);

	const fetchUsers = () => {
		getUsers(
			{
				page: 1,
				pageSize: MAX_PAGE_SIZE,
			},
			true,
		);
	};

	return (
		<Content title="Users">
			<Box>
				<Spin spinning={usersStatus === request.REQUESTING}>
					<TableHeader
						buttonName="Create User"
						onCreate={() => setCreateUserModalVisible(true)}
					/>
					<BranchUsers dataSource={dataSource} />
				</Spin>
			</Box>

			{createUserModalVisible && (
				<CreateUserModal
					onSuccess={fetchUsers}
					onClose={() => setCreateUserModalVisible(false)}
					branchUsersOnly
				/>
			)}
		</Content>
	);
};
