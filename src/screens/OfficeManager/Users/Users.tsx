import { Tabs } from 'antd';
import { AddIcon, Content, ModifyUserModal } from 'components';
import { Box, Button } from 'components/elements';
import { useBranches, useQueryParams } from 'hooks';
import { toString } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { BranchUsers } from './components/BranchUsers';
import './style.scss';

export const Users = () => {
	// STATES
	const [modifyUserModalVisible, setModifyUserModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	// CUSTOM HOOKS

	const queryClient = useQueryClient();
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
			handleTabClick(branches?.[0]?.id);
		}
	}, [branches, currentBranchId]);

	const handleTabClick = (branchId) => {
		setQueryParams(
			{ branchId },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	const handleSuccess = (user) => {
		queryClient.setQueriesData<any>('useUsers', (cachedData) => {
			cachedData.data.results = [user, ...cachedData.data.results];
			return cachedData;
		});
	};

	return (
		<Content title="Users">
			<Box>
				<Tabs
					type="card"
					activeKey={toString(currentBranchId)}
					onTabClick={handleTabClick}
					tabBarExtraContent={
						<Button
							text="Create User"
							variant="primary"
							onClick={() => setModifyUserModalVisible(true)}
							iconDirection="left"
							icon={<AddIcon />}
						/>
					}
					className="my-4 mx-6"
				>
					{branches.map(({ name, id }) => (
						<Tabs.TabPane key={id} tab={name}>
							<BranchUsers
								branchId={id}
								onEditUser={(user) => {
									setModifyUserModalVisible(true);
									setSelectedUser(user);
								}}
							/>
						</Tabs.TabPane>
					))}
				</Tabs>

				{modifyUserModalVisible && (
					<ModifyUserModal
						user={selectedUser}
						onSuccess={handleSuccess}
						onClose={() => {
							setSelectedUser(null);
							setModifyUserModalVisible(false);
						}}
					/>
				)}
			</Box>
			{/* TODO: Temporarily hid the Pending Transactions section. Need to be revisited if this is still needed */}
			{/* <PendingTransactionsSection
				ref={pendingTransactionsRef}
				title="Pending User Transactions"
				transactionType={pendingTransactionTypes.USERS}
				setHasPendingTransactions={setHasPendingTransactions}
				withActionColumn
			/> */}
		</Content>
	);
};
