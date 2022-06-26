import { message, Tabs } from 'antd';
import { Breadcrumb, Content } from 'components';
import { Box } from 'components/elements';
import { useBranchRetrieve, useQueryParams } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { toString } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
	SITE_SETTINGS: 'Site Settings',
	CHECKINGS: 'Checkings',
};

export const ViewBranch = ({ match }: Props) => {
	// VARIABLES
	const branchId = match?.params?.id;

	// CUSTOM HOOKS
	const history = useHistory();
	const {
		params: { tab: currentTab },
		setQueryParams,
	} = useQueryParams();
	const { user } = useAuth();
	const { data: branch, isFetched } = useBranchRetrieve({
		id: branchId,
		options: {
			enabled: !!branchId,
		},
	});

	// METHODS
	useEffect(() => {
		if (!currentTab) {
			onTabClick(tabs.PRODUCTS);
		}
	}, []);

	useEffect(() => {
		if (isFetched && !branch?.online_url) {
			history.replace(`${getUrlPrefix(user.user_type)}/branches`);
			message.error('Branch has no online url.');
		}
	}, [branchId, branch, isFetched]);

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
			title="[VIEW] Branch"
			rightTitle={branch?.name}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			<Box className="ViewBranchMachine">
				<Tabs
					type="card"
					className="PaddingHorizontal PaddingVertical"
					activeKey={toString(currentTab)}
					onTabClick={onTabClick}
					destroyInactiveTabPane
				>
					<Tabs.TabPane
						key={tabs.PRODUCTS}
						tab={tabs.PRODUCTS}
						disabled={!branch?.online_url}
					>
						<TabBranchProducts branchId={branchId} />
					</Tabs.TabPane>

					{/* <Tabs.TabPane
						key={tabs.PENDING_PRICE_UPDATES}
						tab={tabs.PENDING_PRICE_UPDATES}
						disabled={!branch?.online_url}
					>
						<ViewBranchPendingPriceUpdates branchId={branchId} />
					</Tabs.TabPane> */}

					<Tabs.TabPane
						key={tabs.MACHINES}
						tab={tabs.MACHINES}
						disabled={!branch?.online_url}
					>
						<TabBranchMachines branchId={branchId} />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.TRANSACTIONS}
						tab={tabs.TRANSACTIONS}
						disabled={!branch?.online_url}
					>
						<TabTransactions branchId={branchId} />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.SESSIONS}
						tab={tabs.SESSIONS}
						disabled={!branch?.online_url}
					>
						<TabSessions branchId={branchId} />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.DAYS}
						tab={tabs.DAYS}
						disabled={!branch?.online_url}
					>
						<TabDays branchId={branchId} />
					</Tabs.TabPane>

					{/* <Tabs.TabPane
						key={tabs.SITE_SETTINGS}
						tab={tabs.SITE_SETTINGS}
						disabled={!branch?.online_url}
					>
						<ViewBranchSiteSettings branchId={branchId} />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.CHECKINGS}
						tab={tabs.CHECKINGS}
						disabled={!branch?.online_url}
					>
						<ViewBranchCheckings branchId={branchId} />
					</Tabs.TabPane> */}
				</Tabs>
			</Box>
		</Content>
	);
};
