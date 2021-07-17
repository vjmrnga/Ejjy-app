/* eslint-disable react/jsx-wrap-multilines */
import { message, Spin, Tabs } from 'antd';
import { toString } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AddIcon, Content, TableActions } from '../../../components';
import { Box, Button } from '../../../components/elements';
import { PendingTransactionsSection } from '../../../components/PendingTransactionsSection/PendingTransactionsSection';
import { NO_BRANCH_ID } from '../../../global/constants';
import {
	pendingTransactionTypes,
	request,
	userTypes,
} from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { usePendingTransactions } from '../../../hooks/usePendingTransactions';
import { getUserTypeName, showErrorMessages } from '../../../utils/function';
import { useUsers } from '../hooks/useUsers';
import { BranchUsers } from './components/BranchUsers';
import { CreateUserModal } from './components/CreateUserModal';
import { EditUserModal } from './components/EditUserModal';
import './style.scss';

const { TabPane } = Tabs;

export const Users = () => {
	// STATES
	const [tabActiveKey, setTabActiveKey] = useState(null);
	const [editUserModalVisible, setEditUserModalVisible] = useState(false);
	const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	// CUSTOM HOOKS
	const history = useHistory();
	const { branches } = useBranches();
	const {
		users,
		getUsers,
		getOnlineUsers,
		removeUser,
		status: usersStatus,
		errors,
		warnings,
		reset,
	} = useUsers();
	const {
		pendingTransactions,
		listPendingTransactions,
		status: pendingTransactionsStatus,
		recentRequest: pendingTransactionRecentRequest,
	} = usePendingTransactions();

	useEffect(() => {
		if (branches?.length) {
			onTabClick(branches?.[0]?.id);
		}
	}, [branches]);

	useEffect(() => {
		if (usersStatus === request.ERROR && errors?.length) {
			showErrorMessages(errors);
			reset();
		}
	}, [usersStatus, errors]);

	useEffect(() => {
		if (usersStatus === request.SUCCESS && warnings?.length) {
			warnings?.forEach((warning) => {
				message.warning(warning);
			});
		}
	}, [usersStatus, warnings]);

	const getFetchLoading = useCallback(
		() =>
			usersStatus === request.REQUESTING ||
			(pendingTransactionsStatus === request.REQUESTING &&
				pendingTransactionRecentRequest ===
					pendingTransactionsStatus.LIST_PENDING_TRANSACTIONS),
		[usersStatus, pendingTransactionsStatus, pendingTransactionRecentRequest],
	);

	const getTableDataSource = (branchId) => {
		const hasPendingTransactions = pendingTransactions.some(
			({ request_model }) => request_model === pendingTransactionTypes.USERS,
		);

		const isBranchUsers = [
			userTypes.BRANCH_MANAGER,
			userTypes.BRANCH_PERSONNEL,
		];
		const newData =
			usersStatus === request.SUCCESS
				? users
						?.filter(({ user_type }) => isBranchUsers.includes(user_type))
						?.map((user) => {
							const { id, first_name, last_name, user_type } = user;

							const userWithBranch = {
								...user,
								branch: { id: branchId },
							};

							return {
								name: `${first_name} ${last_name}`,
								type: getUserTypeName(user_type),
								action: hasPendingTransactions ? null : (
									<TableActions
										onAssign={
											branchId !== NO_BRANCH_ID
												? () => history.push(`/users/assign/${id}`)
												: null
										}
										onEdit={
											isBranchUsers.includes(user_type)
												? () => onEditUser(userWithBranch)
												: null
										}
										onRemove={
											isBranchUsers.includes(user_type)
												? () => onRemoveUser(userWithBranch)
												: null
										}
									/>
								),
							};
						})
				: [];

		return newData;
	};

	const onTabClick = (branchId) => {
		// eslint-disable-next-line eqeqeq
		const getUserFn = branchId == NO_BRANCH_ID ? getOnlineUsers : getUsers;
		getUserFn({ branchId });
		setTabActiveKey(toString(branchId));
	};

	const onEditUser = (user) => {
		setEditUserModalVisible(true);
		setSelectedUser(user);
	};

	const onCreateUser = () => {
		setCreateUserModalVisible(true);
	};

	const onRemoveUser = (user) => {
		removeUser(user.id, ({ status, response }) => {
			if (status === request.SUCCESS) {
				if (response?.length) {
					message.warning(
						'We found an error while deleting the user in local branch. Please check the pending transaction table below.',
					);
					listPendingTransactions(null);
				}

				onTabClick(user?.branch?.id);
			}
		});
	};

	const onSuccessEditUser = (branchId) => {
		onTabClick(branchId);
	};

	return (
		<Content title="Users">
			<Box>
				<Spin spinning={getFetchLoading()}>
					<Tabs
						type="card"
						activeKey={tabActiveKey}
						onTabClick={onTabClick}
						tabBarExtraContent={
							<Button
								text="Create User"
								variant="primary"
								onClick={onCreateUser}
								iconDirection="left"
								icon={<AddIcon />}
							/>
						}
						style={{ padding: '20px 25px' }}
					>
						{branches.map(({ name, id, online_url }) => (
							<TabPane key={id} tab={name} disabled={!online_url}>
								<BranchUsers dataSource={getTableDataSource(id)} />
							</TabPane>
						))}

						<TabPane key={NO_BRANCH_ID} tab="No Branches">
							<BranchUsers dataSource={getTableDataSource(NO_BRANCH_ID)} />
						</TabPane>
					</Tabs>
				</Spin>

				<CreateUserModal
					visible={createUserModalVisible}
					onSuccess={() => onTabClick(NO_BRANCH_ID)}
					onClose={() => setCreateUserModalVisible(false)}
				/>

				<EditUserModal
					user={selectedUser}
					visible={editUserModalVisible}
					onFetchPendingTransactions={listPendingTransactions}
					onSuccess={onSuccessEditUser}
					onClose={() => setEditUserModalVisible(false)}
				/>
			</Box>

			<PendingTransactionsSection
				title="Pending User Transactions"
				transactionType={pendingTransactionTypes.USERS}
			/>
		</Content>
	);
};
