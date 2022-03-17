import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { QueryClient, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import {
	Content,
	CreateUserModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from '../../../components';
import { Box } from '../../../components/elements';
import { MAX_PAGE_SIZE } from '../../../global/constants';
import { useUsers } from '../../../hooks';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { convertIntoArray, getUserTypeName } from '../../../utils/function';
import { BranchUsers } from '../../OfficeManager/Users/components/BranchUsers';
import './style.scss';

export const Users = () => {
	// STATES
	const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const queryClient = useQueryClient();
	const history = useHistory();
	const {
		isFetching,
		data: { users },
		error,
	} = useUsers({
		params: {
			page: 1,
			pageSize: MAX_PAGE_SIZE,
		},
	});

	// METHODS
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

	const onSuccess = (user) => {
		queryClient.setQueriesData<any>('useUsers', (cachedData) => {
			cachedData.data.results = [user, ...cachedData.data.results];
			return cachedData;
		});
	};

	return (
		<Content title="Users">
			<Box>
				<Spin spinning={isFetching}>
					<TableHeader
						buttonName="Create User"
						onCreate={() => setCreateUserModalVisible(true)}
					/>

					<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

					<BranchUsers dataSource={dataSource} />
				</Spin>
			</Box>

			{createUserModalVisible && (
				<CreateUserModal
					onSuccess={onSuccess}
					onClose={() => setCreateUserModalVisible(false)}
					branchUsersOnly
				/>
			)}
		</Content>
	);
};
