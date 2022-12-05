import { Tabs } from 'antd';
import { Content, LogsInfo } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import React from 'react';
import { TabBranchAssignments } from 'screens/Shared/Assignments/components/TabBranchAssignments';
import { TabSessionAssignments } from 'screens/Shared/Assignments/components/TabSessionAssignments';
import { TabBranchProductLogs } from 'screens/Shared/Logs/components/TabBranchProductLogs';
import { isStandAlone } from 'utils';
import { TabCashBreakdowns } from './components/TabCashBreakdowns';
import { TabUserLogs } from './components/TabUserLogs';

export const tabs = {
	USER: 'User',
	BRANCH: 'Branch Assignment',
	SESSION: 'Cashiering Session',
	CASH_BREAKDOWN: 'Cash Breakdown',
	BRANCH_PRODUCTS: 'Branch Products',
};

export const Logs = () => {
	// CUSTOM HOOKS
	const {
		params: { tab },
		setQueryParams,
	} = useQueryParams();

	// METHODS
	const handleTabClick = (selectedTab) => {
		setQueryParams(
			{ tab: selectedTab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Logs">
			<LogsInfo />

			<Box>
				<Tabs
					activeKey={_.toString(tab) || tabs.USER}
					className="pa-6"
					type="card"
					destroyInactiveTabPane
					onTabClick={handleTabClick}
				>
					<Tabs.TabPane key={tabs.USER} tab={tabs.USER}>
						<TabUserLogs />
					</Tabs.TabPane>

					{!isStandAlone() && (
						<Tabs.TabPane key={tabs.BRANCH} tab={tabs.BRANCH}>
							<TabBranchAssignments />
						</Tabs.TabPane>
					)}

					<Tabs.TabPane key={tabs.SESSION} tab={tabs.SESSION}>
						<TabSessionAssignments />
					</Tabs.TabPane>

					<Tabs.TabPane key={tabs.CASH_BREAKDOWN} tab={tabs.CASH_BREAKDOWN}>
						<TabCashBreakdowns />
					</Tabs.TabPane>

					<Tabs.TabPane key={tabs.BRANCH_PRODUCTS} tab={tabs.BRANCH_PRODUCTS}>
						<TabBranchProductLogs />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
