import { message, Tabs } from 'antd';
import { toString } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Breadcrumb, Content } from '../../../components';
import { Box } from '../../../components/elements';
import { selectors as branchesSelectors } from '../../../ducks/OfficeManager/branches';
import { useAuth } from '../../../hooks/useAuth';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { getUrlPrefix } from '../../../utils/function';
import { ViewBranchCheckings } from './components/ViewBranchCheckings';
import { ViewBranchDays } from './components/ViewBranchDays';
import { ViewBranchMachines } from './components/ViewBranchMachines';
import { ViewBranchPendingPriceUpdates } from './components/ViewBranchPendingPriceUpdates';
import { ViewBranchProducts } from './components/ViewBranchProducts';
import { ViewBranchSessions } from './components/ViewBranchSessions';
import { ViewBranchSiteSettings } from './components/ViewBranchSiteSettings';
import { ViewBranchTransactions } from './components/ViewBranchTransactions';
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
	const branch = useSelector(
		branchesSelectors.selectBranchById(Number(branchId)),
	);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const {
		params: { tab: currentTab },
		setQueryParams,
	} = useQueryParams();

	// METHODS
	useEffect(() => {
		if (!currentTab) {
			onTabClick(tabs.PRODUCTS);
		}
	}, []);

	useEffect(() => {
		if (!branch?.online_url) {
			history.replace(`${getUrlPrefix(user.user_type)}/branches`);
			message.error('Branch has no online url.');
		}
	}, [branchId, branch]);

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
			<Box className="ViewBranch">
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
						<ViewBranchProducts branchId={branchId} />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.PENDING_PRICE_UPDATES}
						tab={tabs.PENDING_PRICE_UPDATES}
						disabled={!branch?.online_url}
					>
						<ViewBranchPendingPriceUpdates branchId={branchId} />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.MACHINES}
						tab={tabs.MACHINES}
						disabled={!branch?.online_url}
					>
						<ViewBranchMachines branchId={branchId} />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.TRANSACTIONS}
						tab={tabs.TRANSACTIONS}
						disabled={!branch?.online_url}
					>
						<ViewBranchTransactions branchId={branchId} />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.SESSIONS}
						tab={tabs.SESSIONS}
						disabled={!branch?.online_url}
					>
						<ViewBranchSessions branchId={branchId} />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.DAYS}
						tab={tabs.DAYS}
						disabled={!branch?.online_url}
					>
						<ViewBranchDays branchId={branchId} />
					</Tabs.TabPane>

					<Tabs.TabPane
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
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
