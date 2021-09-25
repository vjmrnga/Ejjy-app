import { Spin, Tabs } from 'antd';
import * as queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Content, RequestErrors } from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { useProductCategories } from '../../../hooks/useProductCategories';
import { convertIntoArray } from '../../../utils/function';
import { ReportsBranch } from './components/ReportsBranch';
import './style.scss';

export const Reports = () => {
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
		<Content className="Reports" title="Reports">
			<Box>
				<Spin
					size="large"
					spinning={productCategoriesStatus === request.REQUESTING}
				>
					<RequestErrors
						errors={convertIntoArray(productCategoriesErrors)}
						withSpaceBottom
					/>

					<Tabs
						defaultActiveKey={branches?.[0]?.id}
						className="PaddingHorizontal PaddingVertical"
						type="card"
						onTabClick={onTabClick}
					>
						{branches.map(({ name, id, online_url }) => (
							<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
								<ReportsBranch
									branchId={id}
									productCategories={productCategories}
									isActive={id === Number(currentBranchId)}
								/>
							</Tabs.TabPane>
						))}
					</Tabs>
				</Spin>
			</Box>
		</Content>
	);
};
