import { Alert, Tabs } from 'antd';
import { AddIcon, ConnectionAlert, Content, ModifyUserModal } from 'components';
import { Box, Button } from 'components/elements';
import { useBranches, usePingOnlineServer, useQueryParams } from 'hooks';
import { toString } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
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
	const queryClient = useQueryClient();
	const { isConnected } = usePingOnlineServer();
	const {
		params: { branchId: currentBranchId },
		setQueryParams,
	} = useQueryParams();
	const {
		data: { branches },
	} = useBranches();

	// METHODS
	useEffect(() => {
		if (branches && !currentBranchId) {
			handleTabClick(NO_BRANCH_ID);
		}
	}, [branches, currentBranchId]);

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
				<Tabs
					type="card"
					activeKey={toString(currentBranchId)}
					onTabClick={handleTabClick}
					tabBarExtraContent={
						<Button
							disabled={isConnected === false}
							text="Create User"
							variant="primary"
							onClick={() => setModifyUserModalVisible(true)}
							iconDirection="left"
							icon={<AddIcon />}
						/>
					}
					className="pa-6"
				>
					<Tabs.TabPane key={NO_BRANCH_ID} tab="No Branch">
						<BranchUsers
							branchId={NO_BRANCH_ID}
							disabled={isConnected === false}
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

					{branches.map(({ name, id }) => (
						<Tabs.TabPane key={id} tab={name}>
							<BranchUsers
								branchId={id}
								disabled={isConnected === false}
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

				{modifyUserModalVisible && (
					<ModifyUserModal
						user={selectedUser}
						onClose={() => {
							setModifyUserModalVisible(false);
							setSelectedUser(null);
						}}
					/>
				)}

				{reassignUserModalVisible && (
					<BranchAssignmentUserModal
						user={selectedUser}
						onSuccess={() => {
							queryClient.invalidateQueries('useUsers');
						}}
						onClose={() => {
							setReassignUserModalVisible(false);
							setSelectedUser(null);
						}}
					/>
				)}
			</Box>
		</Content>
	);
};
