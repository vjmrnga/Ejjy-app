import { Spin, Tabs } from 'antd';
import {
	Breadcrumb,
	ConnectionAlert,
	Content,
	ViewBranchInfo,
} from 'components';
import { Box } from 'components/elements';
import { useBranchRetrieve, usePingOnlineServer, useQueryParams } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { toString } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { getUrlPrefix } from 'utils';
import { TabBranchMachines } from './components/TabBranchMachines';
import { TabBranchProducts } from './components/TabBranchProducts';
import { TabDays } from './components/TabDays';
import { TabSessions } from './components/TabSessions';
import { TabTransactions } from './components/TabTransactions';
import './style.scss';

interface Props {
	match: any;
}

const tabs = {
	PRODUCTS: 'Products',
	PENDING_PRICE_UPDATES: 'Pending Price Updates',
	MACHINES: 'Machines',
	TRANSACTIONS: 'Transactions',
	SESSIONS: 'Sessions',
	DAYS: 'Days',
	CHECKINGS: 'Checkings',
};

export const ViewBranch = ({ match }: Props) => {
	// VARIABLES
	const branchIdParam = match?.params?.id;

	// CUSTOM HOOKS
	const { isConnected } = usePingOnlineServer();
	const {
		params: { tab: currentTab },
		setQueryParams,
	} = useQueryParams();
	const { user } = useAuth();
	const { data: branch, isFetching: isFetchingBranch } = useBranchRetrieve({
		id: branchIdParam,
		options: {
			enabled: !!branchIdParam,
		},
	});

	// METHODS
	useEffect(() => {
		if (!currentTab) {
			onTabClick(tabs.PRODUCTS);
		}
	}, []);

	const getBreadcrumbItems = useCallback(
		() => [
			{ name: 'Branches', link: `${getUrlPrefix(user.user_type)}/branches` },
			{ name: branch?.name },
		],
		[branch, user],
	);

	const onTabClick = (tab) => {
		setQueryParams(
			{ tab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
			rightTitle={branch?.name}
			title="[VIEW] Branch"
		>
			<ConnectionAlert />

			<ViewBranchInfo />

			<Spin spinning={isFetchingBranch}>
				{branch && (
					<Box className="ViewBranchMachine">
						<Tabs
							activeKey={toString(currentTab)}
							className="PaddingHorizontal PaddingVertical"
							type="card"
							destroyInactiveTabPane
							onTabClick={onTabClick}
						>
							<Tabs.TabPane key={tabs.PRODUCTS} tab={tabs.PRODUCTS}>
								<TabBranchProducts
									branch={branch}
									disabled={isConnected === false}
								/>
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.MACHINES} tab={tabs.MACHINES}>
								<TabBranchMachines
									branch={branch}
									disabled={isConnected === false}
								/>
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.TRANSACTIONS} tab={tabs.TRANSACTIONS}>
								<TabTransactions branch={branch} />
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.SESSIONS} tab={tabs.SESSIONS}>
								<TabSessions branch={branch} />
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.DAYS} tab={tabs.DAYS}>
								<TabDays branch={branch} />
							</Tabs.TabPane>
						</Tabs>
					</Box>
				)}
			</Spin>
		</Content>
	);
};
