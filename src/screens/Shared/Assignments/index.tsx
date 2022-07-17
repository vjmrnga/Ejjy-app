import { Tabs } from 'antd';
import { Content } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import { toString } from 'lodash';
import React, { useEffect } from 'react';
import { TabBranchAssignments } from './components/TabBranchAssignments';
import { TabSessionAssignments } from './components/TabSessionAssignments';

export const assignmentTabs = {
	BRANCH: 'Branch',
	SESSION: 'Session',
};

export const Assignments = () => {
	// CUSTOM HOOKS
	const {
		params: { tab: currentTab },
		setQueryParams,
	} = useQueryParams();

	// METHODS
	useEffect(() => {
		if (!currentTab) {
			onTabClick(assignmentTabs.BRANCH);
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
					<Tabs.TabPane key={assignmentTabs.BRANCH} tab={assignmentTabs.BRANCH}>
						<TabBranchAssignments />
					</Tabs.TabPane>
					<Tabs.TabPane
						key={assignmentTabs.SESSION}
						tab={assignmentTabs.SESSION}
					>
						<TabSessionAssignments />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
