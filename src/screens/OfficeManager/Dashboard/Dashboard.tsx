import { Spin, Tabs } from 'antd';
import { Content, RequestErrors } from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE } from 'global';
import { useBranches, useProductCategories, useQueryParams } from 'hooks';
import { toString } from 'lodash';
import React, { useEffect } from 'react';
import { convertIntoArray } from 'utils';
import { BranchBalanceItem } from './components/BranchBalanceItem';
import './style.scss';

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
		params: {
			pageSize: MAX_PAGE_SIZE,
		},
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
			page: 1,
			pageSize: 10,
		});
	};

	return (
		<Content className="Dashboard" title="Dashboard">
			<Box padding>
				<Spin spinning={isFetchingProductCategories}>
					<RequestErrors
						errors={convertIntoArray(productCategoriesErrors)}
						withSpaceBottom
					/>

					<Tabs
						activeKey={toString(currentBranchId)}
						type="card"
						destroyInactiveTabPane
						onTabClick={onTabClick}
					>
						{branches.map(({ name, id, online_url }) => (
							<Tabs.TabPane key={id} disabled={!online_url} tab={name}>
								<BranchBalanceItem
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
