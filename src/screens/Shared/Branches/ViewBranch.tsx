import { message, Tabs } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Breadcrumb, Content } from '../../../components';
import { Box } from '../../../components/elements';
import { selectors as branchesSelectors } from '../../../ducks/OfficeManager/branches';
import { ViewBranchDays } from './components/ViewBranchDays';
import { ViewBranchMachines } from './components/ViewBranchMachines';
import { ViewBranchProducts } from './components/ViewBranchProducts';
import { ViewBranchSessions } from './components/ViewBranchSessions';
import { ViewBranchTransactions } from './components/ViewBranchTransactions';
import './style.scss';

interface Props {
	match: any;
}

const tabs = {
	PRODUCTS: 'Products',
	MACHINES: 'Machines',
	TRANSACTIONS: 'Transactions',
	SESSIONS: 'Sessions',
	DAYS: 'Days',
};

const ViewBranch = ({ match }: Props) => {
	// VARIABLES
	const branchId = match?.params?.id;
	const branch = useSelector(
		branchesSelectors.selectBranchById(Number(branchId)),
	);

	// CUSTOM HOOKS
	const history = useHistory();

	// Effect: Fetch branch products
	useEffect(() => {
		if (!branch?.online_url) {
			history.replace('/branches');
			message.error('Branch has no online url.');
		}
	}, [branchId, branch]);

	const getBreadcrumbItems = useCallback(
		() => [{ name: 'Branches', link: '/branches' }, { name: branch?.name }],
		[branch],
	);

	return (
		<Content
			title="[VIEW] Branch"
			rightTitle={branch?.name}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			<Box className="ViewBranch">
				<Tabs
					defaultActiveKey={tabs.PRODUCTS}
					style={{ padding: '20px 25px' }}
					type="card"
				>
					<Tabs.TabPane
						key={tabs.PRODUCTS}
						tab={tabs.PRODUCTS}
						disabled={!branch?.online_url}
					>
						<ViewBranchProducts branch={branch} />
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
				</Tabs>
			</Box>
		</Content>
	);
};

export default ViewBranch;
