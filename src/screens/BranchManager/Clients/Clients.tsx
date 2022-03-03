import { Tabs } from 'antd';
import { toString } from 'lodash';
import React, { useEffect } from 'react';
import { Content } from '../../../components';
import { Box } from '../../../components/elements';
import { useAuth } from '../../../hooks/useAuth';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { ClientAccounts } from './components/ClientAccounts/ClientAccounts';
import { ClientCreditRegistrations } from './components/ClientCreditRegistration/ClientCreditRegistrations';
import { ClientCreditTransactions } from './components/ClientCreditTransactions';
import './style.scss';

const tabs = {
	ACCOUNTS: 'Accounts',
	CREDIT_REGISTRATIONS: 'Credit Registrations',
	CREDIT_TRANSACTIONS: 'Credit Transactions',
};

export const Clients = () => {
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
		<Content title="Clients">
			<Box className="ViewBranchMachine">
				<Tabs
					type="card"
					className="PaddingHorizontal PaddingVertical"
					activeKey={toString(currentTab)}
					onTabClick={onTabClick}
					destroyInactiveTabPane
				>
					<Tabs.TabPane key={tabs.ACCOUNTS} tab={tabs.ACCOUNTS}>
						<ClientAccounts />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.CREDIT_REGISTRATIONS}
						tab={tabs.CREDIT_REGISTRATIONS}
					>
						<ClientCreditRegistrations />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.CREDIT_TRANSACTIONS}
						tab={tabs.CREDIT_TRANSACTIONS}
					>
						<ClientCreditTransactions />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
