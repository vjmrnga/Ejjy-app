import { Tabs } from 'antd';
import { Content } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { toString } from 'lodash';
import React, { useEffect } from 'react';
import { TabAccounts } from 'screens/BranchManager/Accounts/components/TabAccounts';
import { TabCollectionReceipts } from 'screens/BranchManager/Accounts/components/TabCollectionReceipts';
import { TabCreditRegistrations } from 'screens/BranchManager/Accounts/components/TabCreditRegistration';
import { TabCreditTransactions } from 'screens/BranchManager/Accounts/components/TabCreditTransactions';
import { TabOrderOfPayments } from 'screens/BranchManager/Accounts/components/TabOrderOfPayments';
import { accountTabs } from 'screens/BranchManager/Accounts/data';
import './style.scss';

export const Accounts = () => {
	// CUSTOM HOOKS
	const {
		params: { tab: currentTab },
		setQueryParams,
	} = useQueryParams();
	const { user } = useAuth();

	// METHODS
	useEffect(() => {
		if (!currentTab) {
			onTabClick(accountTabs.ACCOUNTS);
		}
	}, [currentTab]);

	const onTabClick = (tab) => {
		setQueryParams(
			{ tab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Accounts">
			<Box className="ViewBranchMachine">
				<Tabs
					type="card"
					className="PaddingHorizontal PaddingVertical"
					activeKey={toString(currentTab)}
					onTabClick={onTabClick}
					destroyInactiveTabPane
				>
					<Tabs.TabPane key={accountTabs.ACCOUNTS} tab={accountTabs.ACCOUNTS}>
						<TabAccounts />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={accountTabs.CREDIT_ACCOUNTS}
						tab={accountTabs.CREDIT_ACCOUNTS}
					>
						<TabCreditRegistrations />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={accountTabs.CREDIT_TRANSACTIONS}
						tab={accountTabs.CREDIT_TRANSACTIONS}
					>
						<TabCreditTransactions />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={accountTabs.ORDER_OF_PAYMENTS}
						tab={accountTabs.ORDER_OF_PAYMENTS}
					>
						<TabOrderOfPayments />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={accountTabs.COLLECTION_RECEIPTS}
						tab={accountTabs.COLLECTION_RECEIPTS}
					>
						<TabCollectionReceipts />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
