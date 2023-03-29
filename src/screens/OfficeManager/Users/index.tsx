import { PlusOutlined } from '@ant-design/icons';
import { Button, Spin, Tabs } from 'antd';
import {
	ConnectionAlert,
	Content,
	ModifyUserModal,
	RequestErrors,
} from 'components';
import { Box } from 'components/elements';
import {
	useBranches,
	usePingOnlineServer,
	useQueryParams,
	useUserPendingApprovals,
} from 'hooks';
import _ from 'lodash';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { convertIntoArray, getId } from 'utils';
import { BranchAssignmentUserModal } from './components/BranchAssignmentUserModal';
import { BranchUsers } from './components/BranchUsers';

const NO_BRANCH_ID = -1;

export const Users = () => {
	// STATES
	const [modifyUserModalVisible, setModifyUserModalVisible] = useState(false);
	const [reassignUserModalVisible, setReassignUserModalVisible] =
		useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	// CUSTOM HOOKS
	const { isConnected } = usePingOnlineServer();
	const queryClient = useQueryClient();
	const {
		params: { branchId: currentBranchId },
		setQueryParams,
	} = useQueryParams();
	const {
		data: { branches },
		isFetching: isFetchingBranches,
		error: branchesError,
	} = useBranches();
	const {
		isFetchedAfterMount: isUserPendingApprovalsFetched,
		isFetching: isFetchingUserPendingApprovals,
		error: userPendingApprovalsError,
	} = useUserPendingApprovals({
		options: {
			onSuccess: () => {
				queryClient.invalidateQueries('useUsers');
			},
			notifyOnChangeProps: ['isFetched', 'isFetching', 'error'],
		},
	});

	// METHODS
	const handleTabClick = (branchId) => {
		setQueryParams(
			{ branchId },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Users">
			<ConnectionAlert />

			<Box>
				<Spin spinning={isFetchingBranches || isFetchingUserPendingApprovals}>
					<RequestErrors
						errors={[
							...convertIntoArray(branchesError, 'Branches'),
							...convertIntoArray(
								userPendingApprovalsError,
								'User Pending Approvals',
							),
						]}
						withSpaceBottom
					/>

					<Tabs
						activeKey={_.toString(currentBranchId) || _.toString(NO_BRANCH_ID)}
						className="pa-6"
						tabBarExtraContent={
							<Button
								disabled={isConnected === false}
								icon={<PlusOutlined />}
								type="primary"
								onClick={() => setModifyUserModalVisible(true)}
							>
								Create User
							</Button>
						}
						type="card"
						onTabClick={handleTabClick}
					>
						<Tabs.TabPane key={NO_BRANCH_ID} tab="User List">
							<BranchUsers
								branch={{ id: NO_BRANCH_ID, online_id: NO_BRANCH_ID }}
								disabled={isConnected === false}
								isFetchUsersEnabled={isUserPendingApprovalsFetched}
								onEditUser={(user) => {
									setModifyUserModalVisible(true);
									setSelectedUser(user);
								}}
								onReassignUser={(user) => {
									setReassignUserModalVisible(true);
									setSelectedUser(user);
								}}
							/>
						</Tabs.TabPane>

						{branches.map((branch) => (
							<Tabs.TabPane key={getId(branch)} tab={branch.name}>
								<BranchUsers
									branch={branch}
									disabled={isConnected === false}
									isFetchUsersEnabled={isUserPendingApprovalsFetched}
									onEditUser={(user) => {
										setModifyUserModalVisible(true);
										setSelectedUser(user);
									}}
									onReassignUser={(user) => {
										setReassignUserModalVisible(true);
										setSelectedUser(user);
									}}
								/>
							</Tabs.TabPane>
						))}
					</Tabs>

					{modifyUserModalVisible && selectedUser && (
						<ModifyUserModal
							user={selectedUser}
							onClose={() => {
								setModifyUserModalVisible(false);
								setSelectedUser(null);
							}}
							onSuccess={() => {
								queryClient.invalidateQueries('useUserPendingApprovals');
							}}
						/>
					)}

					{reassignUserModalVisible && selectedUser && (
						<BranchAssignmentUserModal
							branches={branches}
							user={selectedUser}
							onClose={() => {
								setReassignUserModalVisible(false);
								setSelectedUser(null);
							}}
						/>
					)}
				</Spin>
			</Box>
		</Content>
	);
};
