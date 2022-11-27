import { Badge, Space, Tabs } from 'antd';
import { Content, NotificationsInfo } from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE } from 'global';
import { useProblematicAttendanceLogs, useQueryParams } from 'hooks';
import _ from 'lodash';
import React from 'react';
import { TabDTR } from './components/TabDTR';

const tabs = {
	DTR: 'DTR',
};

export const Notifications = () => {
	// CUSTOM HOOKS
	const {
		params: { tab },
		setQueryParams,
	} = useQueryParams();
	const {
		data: { total: problematicAttendanceLogsCount },
	} = useProblematicAttendanceLogs({
		params: {
			pageSize: MAX_PAGE_SIZE,
		},
		options: {
			notifyOnChangeProps: ['data'],
		},
	});

	// METHODS
	const handleTabClick = (selectedTab) => {
		setQueryParams(
			{ tab: selectedTab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Notifications">
			<NotificationsInfo />

			<Box>
				<Tabs
					activeKey={tab ? _.toString(tab) : tabs.DTR}
					className="pa-6"
					defaultActiveKey={tabs.DTR}
					type="card"
					onTabClick={handleTabClick}
				>
					<Tabs.TabPane
						key={tabs.DTR}
						tab={
							<Space align="center">
								<span>{tabs.DTR}</span>
								{problematicAttendanceLogsCount > 0 && (
									<Badge
										count={problematicAttendanceLogsCount}
										overflowCount={999}
									/>
								)}
							</Space>
						}
					>
						<TabDTR />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
