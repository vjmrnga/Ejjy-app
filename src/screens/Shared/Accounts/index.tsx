import { Tabs } from 'antd';
import { ConnectionAlert, Content } from 'components';
import { Box } from 'components/elements';
import { usePingOnlineServer, useQueryParams } from 'hooks';
import { toString } from 'lodash';
import React, { useEffect } from 'react';
import { TabAccounts } from './components/TabAccounts';
import { TabCollectionReceipts } from './components/TabCollectionReceipts';
import { TabCreditRegistrations } from './components/TabCreditRegistration';
import { TabCreditTransactions } from './components/TabCreditTransactions';
import { TabOrderOfPayments } from './components/TabOrderOfPayments';
import { accountTabs } from './data';
import './style.scss';

export const Accounts = () => {
	// CUSTOM HOOKS
	const {
		params: { tab: currentTab },
		setQueryParams,
	} = useQueryParams();
	const { isConnected } = usePingOnlineServer();

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
			<ConnectionAlert />

			<Box className="ViewBranchMachine">
				<Tabs
					activeKey={toString(currentTab)}
					className="PaddingHorizontal PaddingVertical"
					type="card"
					destroyInactiveTabPane
					onTabClick={onTabClick}
				>
					<Tabs.TabPane key={accountTabs.ACCOUNTS} tab={accountTabs.ACCOUNTS}>
						<TabAccounts disabled={isConnected === false} />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={accountTabs.CREDIT_ACCOUNTS}
						tab={accountTabs.CREDIT_ACCOUNTS}
					>
						<TabCreditRegistrations disabled={isConnected === false} />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={accountTabs.CREDIT_TRANSACTIONS}
						tab={accountTabs.CREDIT_TRANSACTIONS}
					>
						<TabCreditTransactions disabled={isConnected === false} />
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
