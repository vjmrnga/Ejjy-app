/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/jsx-wrap-multilines */

import { message, Spin, Tabs } from 'antd';
import { toString } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	AddIcon,
	Content,
	CreateUserModal,
	PendingApprovalBadgePill,
	PendingTransactionsSection,
	TableActions,
} from '../../../components';
import { Box, Button } from '../../../components/elements';
import {
	MAX_PAGE_SIZE,
	NO_BRANCH_ID,
	PENDING_CREATE_USERS_BRANCH_ID,
	PENDING_EDIT_USERS_BRANCH_ID,
} from '../../../global/constants';
import {
	pendingTransactionTypes,
	request,
	userTypes,
} from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { useUsers } from '../../../hooks/useUsers';
import { getUserTypeName, showErrorMessages } from '../../../utils/function';
import { BranchUsers } from './components/BranchUsers';
import { EditUserModal } from './components/EditUserModal';
import './style.scss';

const NOT_BRANCH_IDS = [
	NO_BRANCH_ID,
	PENDING_CREATE_USERS_BRANCH_ID,
	PENDING_EDIT_USERS_BRANCH_ID,
];

const PENDING_BRANCH_IDS = [
	PENDING_CREATE_USERS_BRANCH_ID,
	PENDING_EDIT_USERS_BRANCH_ID,
];

const BRANCH_USERS = [userTypes.BRANCH_MANAGER, userTypes.BRANCH_PERSONNEL];

export const Users = () => {
	// STATES
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

	const {
		params: { branchId: currentBranchId },
		setQueryParams,
		refreshList,
	} = useQueryParams({
		page: 1,
		pageSize: 10,
		onQueryParamChange: (params) => {
			const { branchId } = params;
			if (branchId) {
				const isNotBranchId = NOT_BRANCH_IDS.includes(Number(branchId));

				const getUserFn = isNotBranchId ? getOnlineUsers : getUsers;
				getUserFn(
					{
						page: 1,
						pageSize: MAX_PAGE_SIZE,
						branchId: isNotBranchId ? null : branchId,
						isPendingCreateApproval:
							Number(branchId) === PENDING_CREATE_USERS_BRANCH_ID,
						isPendingUpdateUserTypeApproval:
							Number(branchId) === PENDING_EDIT_USERS_BRANCH_ID,
					},
					true,
				);
			}
		},
	});

	// METHODS
	useEffect(() => {
		if (branches && !currentBranchId) {
			onTabClick(branches?.[0]?.id);
		}
	}, [branches, currentBranchId]);

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
						const { id, first_name, last_name, user_type, employee_id } = user;
						const userWithBranch = {
							...user,
							branch: { id: branchId },
						};

						let action = null;
						if (PENDING_BRANCH_IDS.includes(branchId)) {
							action = <PendingApprovalBadgePill />;
						} else if (!hasPendingTransactions) {
							action = (
								<TableActions
									onAssign={
										!NOT_BRANCH_IDS.includes(branchId) &&
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
							);
						}

						return {
							key: id,
							id: employee_id,
							name: `${first_name} ${last_name}`,
							type: getUserTypeName(user_type),
							action,
						};
				  })
				: [];

		return newData;
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

	const onTabClick = (branchId) => {
		// eslint-disable-next-line eqeqeq
		if (Number(branchId) === Number(currentBranchId)) {
			refreshList();
		}

		setQueryParams(
			{ branchId },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Users">
			<Box>
				<Spin spinning={usersStatus === request.REQUESTING}>
					<Tabs
						type="card"
						activeKey={toString(currentBranchId)}
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
							<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
								<BranchUsers dataSource={getTableDataSource(id)} />
							</Tabs.TabPane>
						))}

						<Tabs.TabPane key={NO_BRANCH_ID} tab="No Branches">
							<BranchUsers dataSource={getTableDataSource(NO_BRANCH_ID)} />
						</Tabs.TabPane>

						<Tabs.TabPane
							key={PENDING_CREATE_USERS_BRANCH_ID}
							tab="Pending Create Users"
						>
							<BranchUsers
								dataSource={getTableDataSource(PENDING_CREATE_USERS_BRANCH_ID)}
							/>
						</Tabs.TabPane>

						<Tabs.TabPane
							key={PENDING_EDIT_USERS_BRANCH_ID}
							tab="Pending Edit Users"
						>
							<BranchUsers
								dataSource={getTableDataSource(PENDING_EDIT_USERS_BRANCH_ID)}
							/>
						</Tabs.TabPane>
					</Tabs>
				</Spin>

				{createUserModalVisible && (
					<CreateUserModal
						onSuccess={(user) => {
							[userTypes.ADMIN, userTypes.OFFICE_MANAGER].includes(user.type)
								? onTabClick(PENDING_CREATE_USERS_BRANCH_ID)
								: onTabClick(NO_BRANCH_ID);
						}}
						onClose={() => setCreateUserModalVisible(false)}
					/>
				)}

				<EditUserModal
					user={selectedUser}
					visible={editUserModalVisible}
					onFetchPendingTransactions={
						pendingTransactionsRef.current?.refreshList
					}
					onSuccessEditUserBranch={(branchId) => {
						onTabClick(branchId);
					}}
					onSuccessEditUserType={() => {
						onTabClick(PENDING_EDIT_USERS_BRANCH_ID);
					}}
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
