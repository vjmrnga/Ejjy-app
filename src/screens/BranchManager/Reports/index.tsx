import { Spin } from 'antd';
import { Content, RequestErrors } from 'components';
import { Box } from 'components/elements';
import { request } from 'global';
import { useProductCategories } from 'hooks/useProductCategories';
import React, { useEffect, useState } from 'react';
import { convertIntoArray } from 'utils';
import { ReportsBranch } from './components/ReportsBranch';

export const Reports = () => {
	// STATES
	const [productCategories, setProductCategories] = useState([]);

	// CUSTOM HOOKS
	const {
		getProductCategories,
		status: productCategoriesStatus,
		errors: productCategoriesErrors,
	} = useProductCategories();

	// METHODS
	useEffect(() => {
		getProductCategories({}, ({ status, data: responseData }) => {
			if (status === request.SUCCESS) {
				setProductCategories(responseData);
			}
		});
	}, []);

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

					<ReportsBranch productCategories={productCategories} />
				</Spin>
			</Box>
		</Content>
	);
};
