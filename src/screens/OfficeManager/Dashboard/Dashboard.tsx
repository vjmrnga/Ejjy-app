import { Spin, Tabs } from 'antd';
import { toString } from 'lodash';
import * as queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Content, RequestErrors } from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { useProductCategories } from '../../../hooks/useProductCategories';
import { convertIntoArray } from '../../../utils/function';
import { BranchBalanceItem } from './components/BranchBalanceItem';
import './style.scss';

export const Dashboard = () => {
	// STATES
	const [productCategories, setProductCategories] = useState([]);

	// CUSTOM HOOKS
	const history = useHistory();
	const { branches } = useBranches();
	const {
		getProductCategories,
		status: productCategoriesStatus,
		errors: productCategoriesErrors,
	} = useProductCategories();

	// VARIABLES
	const { branchId: currentBranchId } = queryString.parse(
		history.location.search,
	);

	// METHODS
	useEffect(() => {
		getProductCategories(({ status, data: responseData }) => {
			if (status === request.SUCCESS) {
				setProductCategories(responseData);
			}
		});
	}, []);

	useEffect(() => {
		if (branches && !currentBranchId) {
			onTabClick(branches?.[0]?.id);
		}
	}, [branches, currentBranchId]);

	const onTabClick = (branchId) => {
		history.push(
			queryString.stringifyUrl({
				url: '',
				query: {
					...queryString.parse(history.location.search),
					branchId,
					page: 1,
					pageSize: 10,
				},
			}),
		);
	};

	return (
		<Content className="Dashboard" title="Dashboard">
			<Box padding>
				<Spin spinning={productCategoriesStatus === request.REQUESTING}>
					<RequestErrors
						errors={convertIntoArray(productCategoriesErrors)}
						withSpaceBottom
					/>

					<Tabs
						type="card"
						activeKey={toString(currentBranchId)}
						onTabClick={onTabClick}
					>
						{branches.map(({ name, id, online_url }) => (
							<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
								<BranchBalanceItem
									branchId={id}
									productCategories={productCategories}
									isActive={id === Number(currentBranchId)}
									disabled={!online_url}
								/>
							</Tabs.TabPane>
						))}
					</Tabs>
				</Spin>
			</Box>
		</Content>
	);
};
