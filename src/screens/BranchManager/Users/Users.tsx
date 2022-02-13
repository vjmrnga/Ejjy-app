import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Content, TableActions } from '../../../components';
import { Box } from '../../../components/elements';
import {
	MAX_PAGE_SIZE,
	NO_BRANCH_ID,
	PENDING_CREATE_USERS_BRANCH_ID,
	PENDING_EDIT_USERS_BRANCH_ID,
} from '../../../global/constants';
import { request, userTypes } from '../../../global/types';
import { useUsers } from '../../../hooks/useUsers';
import { getUserTypeName } from '../../../utils/function';
import { BranchUsers } from '../../OfficeManager/Users/components/BranchUsers';
import './style.scss';

export const Users = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const history = useHistory();
	const { users, getUsers, status: usersStatus } = useUsers();

	// METHODS
	useEffect(() => {
		getUsers({
			page: 1,
			pageSize: MAX_PAGE_SIZE,
		});
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

	return (
		<Content title="Users">
			<Box padding>
				<Spin spinning={usersStatus === request.REQUESTING}>
					<BranchUsers dataSource={dataSource} />
				</Spin>
			</Box>
		</Content>
	);
};
