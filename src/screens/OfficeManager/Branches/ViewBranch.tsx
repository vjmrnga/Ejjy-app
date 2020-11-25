/* eslint-disable react-hooks/exhaustive-deps */
import { Tabs } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb, Container } from '../../../components';
import { Box } from '../../../components/elements';
import { selectors as branchesSelectors } from '../../../ducks/OfficeManager/branches';
import { request } from '../../../global/types';
import { useBranchesDays } from '../../../hooks/useBranchesDays';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import { useSessions } from '../../../hooks/useSessions';
import { useTransactions } from '../../../hooks/useTransactions';
import { ViewBranchDays } from './components/ViewBranchDays';
import { ViewBranchProducts } from './components/ViewBranchProducts';
import { ViewBranchSessions } from './components/ViewBranchSessions';
import { ViewBranchTransactions } from './components/ViewBranchTransactions';
import './style.scss';

interface Props {
	match: any;
}

const tabs = {
	PRODUCTS: 'Products',
	TRANSACTIONS: 'Transactions',
	SESSIONS: 'Sessions',
	DAYS: 'Days',
};

const ViewBranch = ({ match }: Props) => {
	// Routing
	const branchId = match?.params?.id;

	// Custom hooks
	const {
		branchProducts,
		getBranchProductsByBranch,
		status: branchProductsStatus,
	} = useBranchProducts();
	const { transactions, listTransactions, status: transactionsStatus } = useTransactions();
	const { sessions, listSessions, status: sessionsStatus } = useSessions();
	const { branchDays, listBranchDays, status: branchesDaysStatus } = useBranchesDays();
	const branch = useSelector(branchesSelectors.selectBranchById(Number(branchId)));

	// Effect: Fetch branch products
	useEffect(() => {
		getBranchProductsByBranch(branchId);
		listTransactions(branchId);
		listSessions(branchId);
		listBranchDays(branchId);
	}, []);

	const getFetchLoading = useCallback(
		() =>
			[branchProductsStatus, transactionsStatus, sessionsStatus, branchesDaysStatus].includes(
				request.REQUESTING,
			),
		[branchProductsStatus, transactionsStatus, sessionsStatus, branchesDaysStatus],
	);

	const getBreadcrumbItems = useCallback(
		() => [{ name: 'Branches', link: '/branches' }, { name: branch?.name }],
		[branch],
	);

	return (
		<Container
			title="[VIEW] Branch"
			rightTitle={branch?.name}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
			loadingText="Fetching branch details..."
			loading={getFetchLoading()}
		>
			<section>
				<Box className="ViewBranch">
					<Tabs defaultActiveKey={tabs.PRODUCTS} style={{ padding: '20px 25px' }} type="card">
						<Tabs.TabPane key={tabs.PRODUCTS} tab={tabs.PRODUCTS}>
							<ViewBranchProducts branchProducts={branchProducts} branch={branch} />
						</Tabs.TabPane>

						<Tabs.TabPane key={tabs.TRANSACTIONS} tab={tabs.TRANSACTIONS}>
							<ViewBranchTransactions transactions={transactions} />
						</Tabs.TabPane>

						<Tabs.TabPane key={tabs.SESSIONS} tab={tabs.SESSIONS}>
							<ViewBranchSessions sessions={sessions} />
						</Tabs.TabPane>

						<Tabs.TabPane key={tabs.DAYS} tab={tabs.DAYS}>
							<ViewBranchDays branchDays={branchDays} />
						</Tabs.TabPane>
					</Tabs>
				</Box>
			</section>
		</Container>
	);
};

export default ViewBranch;
