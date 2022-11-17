import { Divider, Spin, Tabs } from 'antd';
import { Content, ReportsPerMachine, RequestErrors } from 'components';
import { Box } from 'components/elements';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from 'global';
import { useBranches, useProductCategories, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { convertIntoArray } from 'utils';
import { BranchProductBalances } from './components/BranchProductBalances';

export const Dashboard = () => {
	// CUSTOM HOOKS
	const {
		data: { branches },
		isFetching: isFetchingBranches,
		error: branchesErrors,
	} = useBranches();
	const {
		data: { productCategories },
		isFetching: isFetchingProductCategories,
		error: productCategoriesErrors,
	} = useProductCategories({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	// VARIABLES
	const {
		params: { branchId: currentBranchId },
		setQueryParams,
	} = useQueryParams();

	// METHODS

	useEffect(() => {
		if (branches && !currentBranchId) {
			handleTabClick(branches?.[0]?.id);
		}
	}, [branches, currentBranchId]);

	const handleTabClick = (branchId) => {
		setQueryParams({
			branchId,
			page: DEFAULT_PAGE,
			pageSize: DEFAULT_PAGE_SIZE,
		});
	};

	return (
		<Content title="Dashboard">
			<Box>
				<Spin spinning={isFetchingBranches || isFetchingProductCategories}>
					<RequestErrors
						errors={[
							...convertIntoArray(branchesErrors, 'Branches'),
							...convertIntoArray(
								productCategoriesErrors,
								'Product Categories',
							),
						]}
						withSpaceBottom
					/>

					<Tabs
						activeKey={_.toString(currentBranchId)}
						className="pa-6"
						type="card"
						destroyInactiveTabPane
						onTabClick={handleTabClick}
					>
						{branches.map(({ name, id }) => (
							<Tabs.TabPane key={id} tab={name}>
								<BranchProductBalances
									branchId={id}
									productCategories={productCategories}
								/>

								<Divider />

								<ReportsPerMachine
									branchId={id}
									tableHeaderClassName="pl-0 pt-0"
								/>
							</Tabs.TabPane>
						))}
					</Tabs>
				</Spin>
			</Box>
		</Content>
	);
};
