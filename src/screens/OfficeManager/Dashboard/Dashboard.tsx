import { Spin, Tabs } from 'antd';
import { Content, RequestErrors } from 'components';
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
			onTabClick(branches?.[0]?.id);
		}
	}, [branches, currentBranchId]);

	const onTabClick = (branchId) => {
		setQueryParams({
			branchId,
			page: DEFAULT_PAGE,
			pageSize: DEFAULT_PAGE_SIZE,
		});
	};

	return (
		<Content title="Dashboard">
			<Box>
				<Spin spinning={isFetchingProductCategories}>
					<RequestErrors
						errors={convertIntoArray(productCategoriesErrors)}
						withSpaceBottom
					/>

					<Tabs
						activeKey={_.toString(currentBranchId)}
						className="pa-6"
						type="card"
						destroyInactiveTabPane
						onTabClick={onTabClick}
					>
						{branches.map(({ name, id }) => (
							<Tabs.TabPane key={id} tab={name}>
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
