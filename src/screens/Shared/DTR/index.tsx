import { Tabs } from 'antd';
import { Content } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import React from 'react';
import { useUserStore } from 'stores';
import { isUserFromBranch } from 'utils';
import { TabDTR } from './components/TabDTR';
import { TabDTRPrinting } from './components/TabDTRPrinting';

const tabs = {
	DTR: 'List',
	DTR_PRINTING: 'DTR Printing',
};

export const DTR = () => {
	// CUSTOM HOOKS
	const {
		params: { tab },
		setQueryParams,
	} = useQueryParams();
	const user = useUserStore((state) => state.user);

	// METHODS
	const handleTabClick = (selectedTab) => {
		setQueryParams(
			{ tab: selectedTab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Daily Time Record">
			<Box>
				<Tabs
					activeKey={_.toString(tab) || tabs.DTR}
					className="pa-6"
					type="card"
					destroyInactiveTabPane
					onTabClick={handleTabClick}
				>
					<Tabs.TabPane key={tabs.DTR} tab={tabs.DTR}>
						<TabDTR />
					</Tabs.TabPane>

					{!isUserFromBranch(user.user_type) && (
						<Tabs.TabPane key={tabs.DTR_PRINTING} tab={tabs.DTR_PRINTING}>
							<TabDTRPrinting />
						</Tabs.TabPane>
					)}
				</Tabs>
			</Box>
		</Content>
	);
};
