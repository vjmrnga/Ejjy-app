import { Tabs } from 'antd';
import { Content } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import { toString } from 'lodash';
import React, { useEffect } from 'react';
import { TabUserLogs } from 'screens/BranchManager/Logs/components/TabUserLogs';
import { TabBranchAssignments } from 'screens/Shared/Assignments/components/TabBranchAssignments';
import { TabSessionAssignments } from 'screens/Shared/Assignments/components/TabSessionAssignments';
import { isStandAlone } from 'utils';

export const logsTabs = {
	USER: 'User',
	BRANCH: 'Branch',
	SESSION: 'Session',
};

export const Logs = () => {
	// CUSTOM HOOKS
	const {
		params: { tab: currentTab },
		setQueryParams,
	} = useQueryParams();

	// METHODS
	useEffect(() => {
		if (!currentTab) {
			onTabClick(logsTabs.USER);
		}
	}, [currentTab]);

	const onTabClick = (tab) => {
		setQueryParams(
			{ tab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Assignments">
			<Box>
				<Tabs
					activeKey={toString(currentTab)}
					className="pa-6"
					type="card"
					destroyInactiveTabPane
					onTabClick={onTabClick}
				>
					<Tabs.TabPane key={logsTabs.USER} tab={logsTabs.USER}>
						<TabUserLogs />
					</Tabs.TabPane>
					{!isStandAlone() && (
						<Tabs.TabPane key={logsTabs.BRANCH} tab={logsTabs.BRANCH}>
							<TabBranchAssignments />
						</Tabs.TabPane>
					)}
					<Tabs.TabPane key={logsTabs.SESSION} tab={logsTabs.SESSION}>
						<TabSessionAssignments />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
