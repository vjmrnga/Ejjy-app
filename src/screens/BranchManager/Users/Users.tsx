import { Spin } from 'antd';
import {
	Content,
	CreateUserModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE } from 'global';
import { useUsers } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { convertIntoArray, getFullName, getUserTypeName } from 'utils';
import { BranchUsers } from '../../OfficeManager/Users/components/BranchUsers';

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
		params: { pageSize: MAX_PAGE_SIZE },
	});

	// METHODS
	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { id, user_type, employee_id } = user;

			return {
				key: id,
				id: employee_id,
				name: getFullName(user),
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
