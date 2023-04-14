import { Tabs } from 'antd';
import { Content } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import React from 'react';
import { TabBranchAssignments } from './components/TabBranchAssignments';
import { TabSessionAssignments } from './components/TabSessionAssignments';

export const assignmentTabs = {
	BRANCH: 'Branch',
	SESSION: 'Session',
};

export const Assignments = () => {
	// CUSTOM HOOKS
	const {
		params: { tab = assignmentTabs.BRANCH },
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
		<Content title="Assignments">
			<Box>
				<Tabs
					activeKey={_.toString(tab)}
					className="pa-6"
					type="card"
					destroyInactiveTabPane
					onTabClick={handleTabClick}
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
