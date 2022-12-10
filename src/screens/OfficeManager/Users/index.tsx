import { PlusOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import { ConnectionAlert, Content, ModifyUserModal } from 'components';
import { Box } from 'components/elements';
import { OfficeManagerUsersInfo } from 'components/info/OfficeManagerUsersInfo';
import { useBranches, usePingOnlineServer, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useState } from 'react';
import { getId } from 'utils';
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
	const {
		params: { branchId: currentBranchId },
		setQueryParams,
	} = useQueryParams();
	const {
		data: { branches },
	} = useBranches();

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

			<OfficeManagerUsersInfo />

			<Box>
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
