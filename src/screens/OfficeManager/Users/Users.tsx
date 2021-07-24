/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/jsx-wrap-multilines */
import { message, Spin, Tabs } from 'antd';
import { toString } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AddIcon, Content, TableActions } from '../../../components';
import { Box, Button } from '../../../components/elements';
import { PendingTransactionsSection } from '../../../components/PendingTransactionsSection/PendingTransactionsSection';
import {
	NO_BRANCH_ID,
	PENDING_USERS_BRANCH_ID,
} from '../../../global/constants';
import {
	pendingTransactionTypes,
	request,
	userTypes,
} from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { useUsers } from '../../../hooks/useUsers';
import { getUserTypeName, showErrorMessages } from '../../../utils/function';
import { BranchUsers } from './components/BranchUsers';
import { CreateUserModal } from './components/CreateUserModal';
import { EditUserModal } from './components/EditUserModal';
import './style.scss';

const { TabPane } = Tabs;

const NOT_BRANCH_IDS = [NO_BRANCH_ID, PENDING_USERS_BRANCH_ID];
const BRANCH_USERS = [userTypes.BRANCH_MANAGER, userTypes.BRANCH_PERSONNEL];

export const Users = () => {
	// STATES
	const [tabActiveKey, setTabActiveKey] = useState(null);
	const [editUserModalVisible, setEditUserModalVisible] = useState(false);
	const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [hasPendingTransactions, setHasPendingTransactions] = useState(false);

	// REFS
	const pendingTransactionsRef = useRef(null);

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

	// METHODS
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

	const getTableDataSource = (branchId) => {
		const newData =
			usersStatus === request.SUCCESS
				? users?.map((user) => {
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
										BRANCH_USERS.includes(user_type)
											? () => history.push(`/office-manager/users/assign/${id}`)
											: null
									}
									onEdit={
										BRANCH_USERS.includes(user_type)
											? () => onEditUser(userWithBranch)
											: null
									}
									onRemove={
										BRANCH_USERS.includes(user_type)
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
		const isNotBranchId = NOT_BRANCH_IDS.includes(Number(branchId));

		const getUserFn = isNotBranchId ? getOnlineUsers : getUsers;
		getUserFn({
			branchId: isNotBranchId ? null : branchId,
			isPendingApproval: Number(branchId) === PENDING_USERS_BRANCH_ID,
		});
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
					pendingTransactionsRef.current?.refreshList();
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
				<Spin spinning={usersStatus === request.REQUESTING}>
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

						<TabPane key={PENDING_USERS_BRANCH_ID} tab="Pending Users">
							<BranchUsers
								dataSource={getTableDataSource(PENDING_USERS_BRANCH_ID)}
							/>
						</TabPane>
					</Tabs>
				</Spin>

				<CreateUserModal
					visible={createUserModalVisible}
					onSuccess={(userType) => {
						[userTypes.ADMIN, userTypes.OFFICE_MANAGER].includes(userType)
							? onTabClick(PENDING_USERS_BRANCH_ID)
							: onTabClick(NO_BRANCH_ID);
					}}
					onClose={() => setCreateUserModalVisible(false)}
				/>

				<EditUserModal
					user={selectedUser}
					visible={editUserModalVisible}
					onFetchPendingTransactions={
						pendingTransactionsRef.current?.refreshList
					}
					onSuccess={onSuccessEditUser}
					onClose={() => setEditUserModalVisible(false)}
				/>
			</Box>

			<PendingTransactionsSection
				ref={pendingTransactionsRef}
				title="Pending User Transactions"
				transactionType={pendingTransactionTypes.USERS}
				setHasPendingTransactions={setHasPendingTransactions}
				withActionColumn
			/>
		</Content>
	);
};
