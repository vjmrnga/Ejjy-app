import { Tabs } from 'antd';
import { Content, LogsInfo } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import React from 'react';
import { TabBranchAssignments } from 'screens/Shared/Assignments/components/TabBranchAssignments';
import { TabSessionAssignments } from 'screens/Shared/Assignments/components/TabSessionAssignments';
import { TabBranchProductLogs } from 'screens/Shared/Logs/components/TabBranchProductLogs';
import { TabCashBreakdowns } from 'screens/Shared/Logs/components/TabCashBreakdowns';
import { TabUserLogs } from 'screens/Shared/Logs/components/TabUserLogs';
import { isStandAlone } from 'utils';

export const tabs = {
	BRANCH_PRODUCTS: 'Branch Products',
	BRANCH_ASSIGNMENTS: 'Branch Assignments',
	CASHIERING_ASSIGNMENTS: 'Cashiering Assignments',
	CASH_BREAKDOWNS: 'Cash Breakdowns',
	USERS: 'Users',
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
					activeKey={_.toString(tab) || tabs.BRANCH_PRODUCTS}
					className="pa-6"
					type="card"
					destroyInactiveTabPane
					onTabClick={handleTabClick}
				>
					<Tabs.TabPane key={tabs.BRANCH_PRODUCTS} tab={tabs.BRANCH_PRODUCTS}>
						<TabBranchProductLogs />
					</Tabs.TabPane>

					{!isStandAlone() && (
						<Tabs.TabPane
							key={tabs.BRANCH_ASSIGNMENTS}
							tab={tabs.BRANCH_ASSIGNMENTS}
						>
							<TabBranchAssignments />
						</Tabs.TabPane>
					)}

					<Tabs.TabPane
						key={tabs.CASHIERING_ASSIGNMENTS}
						tab={tabs.CASHIERING_ASSIGNMENTS}
					>
						<TabSessionAssignments />
					</Tabs.TabPane>

					<Tabs.TabPane key={tabs.CASH_BREAKDOWNS} tab={tabs.CASH_BREAKDOWNS}>
						<TabCashBreakdowns />
					</Tabs.TabPane>

					<Tabs.TabPane key={tabs.USERS} tab={tabs.USERS}>
						<TabUserLogs />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
