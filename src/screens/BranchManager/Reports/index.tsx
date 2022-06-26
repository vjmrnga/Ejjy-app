import { Spin } from 'antd';
import { Content, RequestErrors } from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE } from 'global';
import { useProductCategories } from 'hooks';
import React from 'react';
import { convertIntoArray } from 'utils';
import { ReportsBranch } from './components/ReportsBranch';

export const Reports = () => {
	const {
		data: { productCategories },
		isFetching: isFetchingProductCategories,
		error: productCategoriesErrors,
	} = useProductCategories({
		params: {
			pageSize: MAX_PAGE_SIZE,
		},
	});

	return (
		<Content className="Reports" title="Reports">
			<Box>
				<Spin size="large" spinning={isFetchingProductCategories}>
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
