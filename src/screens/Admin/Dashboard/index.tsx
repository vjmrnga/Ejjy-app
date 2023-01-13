import { Divider, Spin, Tabs } from 'antd';
import { Content, RequestErrors } from 'components';
import { Box } from 'components/elements';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from 'global';
import { useBranches, useProductCategories, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { BranchProductBalances } from 'screens/Shared/Dashboard/components/BranchProductBalances';
import { ReportsPerMachine } from 'screens/Shared/Dashboard/components/ReportsPerMachine';
import { convertIntoArray } from 'utils';

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
						className="px-6 pt-6"
						errors={[
							...convertIntoArray(branchesErrors, 'Branches'),
							...convertIntoArray(
								productCategoriesErrors,
								'Product Categories',
							),
						]}
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
								<ReportsPerMachine
									branchId={id}
									tableHeaderClassName="pt-2 px-0"
								/>

								<Divider />

								<BranchProductBalances
									branchId={id}
									productCategories={productCategories}
								/>
							</Tabs.TabPane>
						))}
					</Tabs>
				</Spin>
			</Box>
		</Content>
	);
};
