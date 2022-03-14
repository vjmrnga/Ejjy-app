import { Tabs } from 'antd';
import { toString } from 'lodash';
import React, { useEffect } from 'react';
import { Content } from '../../../components';
import { Box } from '../../../components/elements';
import { useAuth } from '../../../hooks/useAuth';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { TabAccounts } from './components/TabAccounts';
import { TabCollectionReceipts } from './components/TabCollectionReceipts';
import { TabCreditRegistrations } from './components/TabCreditRegistration';
import { TabCreditTransactions } from './components/TabCreditTransactions';
import { TabOrderOfPayments } from './components/TabOrderOfPayments';
import './style.scss';

const tabs = {
	ACCOUNTS: 'Accounts',
	CREDIT_REGISTRATIONS: 'Credit Registrations',
	CREDIT_TRANSACTIONS: 'Credit Transactions',
	ORDER_OF_PAYMENTS: 'Order of Payments',
	COLLECTION_RECEIPTS: 'Collection Receipts',
};

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
			onTabClick(tabs.ACCOUNTS);
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
					<Tabs.TabPane key={tabs.ACCOUNTS} tab={tabs.ACCOUNTS}>
						<TabAccounts />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.CREDIT_REGISTRATIONS}
						tab={tabs.CREDIT_REGISTRATIONS}
					>
						<TabCreditRegistrations />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.CREDIT_TRANSACTIONS}
						tab={tabs.CREDIT_TRANSACTIONS}
					>
						<TabCreditTransactions />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.ORDER_OF_PAYMENTS}
						tab={tabs.ORDER_OF_PAYMENTS}
					>
						<TabOrderOfPayments />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.COLLECTION_RECEIPTS}
						tab={tabs.COLLECTION_RECEIPTS}
					>
						<TabCollectionReceipts />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
