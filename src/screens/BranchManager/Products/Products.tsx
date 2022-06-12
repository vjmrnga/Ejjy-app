import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Select, Table } from 'antd';
import { Content, RequestErrors, TableHeader } from 'components';
import { Box, ButtonLink, Label } from 'components/elements';
import { EMPTY_CELL, SEARCH_DEBOUNCE_TIME } from 'global/constants';
import { pageSizeOptions } from 'global/options';
import { branchProductStatus, request } from 'global/types';
import { useAuth } from 'hooks/useAuth';
import { useBranchProducts } from 'hooks/useBranchProducts';
import { useProductCategories } from 'hooks/useProductCategories';
import { debounce } from 'lodash';
import { IProductCategory } from 'models';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertIntoArray, getBranchProductStatus } from 'utils';
import { ViewProductModal } from './components/ViewProductModal';
import './style.scss';

const columns = [
	{ title: 'Barcode', dataIndex: 'barcode' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'RS ID', dataIndex: 'requisitionSlip' },
];

export const Products = () => {
	// STATES
	const [data, setData] = useState([]);
	const [productCategories, setProductCategories] = useState([]);
	const [selectedBranchProduct, setSelectedBranchProduct] = useState(null);
	const [searchedKeyword, setSearchedKeyword] = useState('');
	const [status, setStatus] = useState(null);
	const [productCategory, setProductCategory] = useState(null);

	// CUSTOM HOOKS

	const { user } = useAuth();
	const {
		branchProducts,
		pageCount,
		pageSize,
		currentPage,
		getBranchProducts,
		status: branchProductsStatus,
		errors: branchProductsErrors,
	} = useBranchProducts();
	const {
		getProductCategories,
		status: productCategoriesStatus,
		errors: productCategoriesErrors,
	} = useProductCategories();

	// METHODS
	useEffect(() => {
		getBranchProducts({ branchId: user?.branch?.id, page: 1 });
		getProductCategories(
			{ branchId: user?.branch?.id },
			({ status: requestStatus, data: responseData }) => {
				if (requestStatus === request.SUCCESS) {
					setProductCategories(responseData);
				}
			},
		);
	}, []);

	// Effect: Format branch products to be rendered in Table
	useEffect(() => {
		setData(
			branchProducts.map((branchProduct) => ({
				barcode: (
					<ButtonLink
						text={
							branchProduct.product.barcode || branchProduct.product.textcode
						}
						onClick={() => setSelectedBranchProduct(branchProduct)}
					/>
				),
				name: branchProduct.product.name,
				status: getBranchProductStatus(branchProduct.product_status),
				requisitionSlip: branchProduct.requisition_slip ? (
					<Link
						to={`/branch-manager/requisition-slips/${branchProduct.requisition_slip?.id}`}
					>
						{branchProduct.requisition_slip?.id}
					</Link>
				) : (
					EMPTY_CELL
				),
			})),
		);
	}, [branchProducts]);

	const onPageChange = (page, newPageSize) => {
		getBranchProducts(
			{
				search: searchedKeyword,
				branchId: user?.branch?.id,
				productCategory,
				productStatus: status,
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	const onSearch = (value) => {
		getBranchProducts(
			{
				search: value,
				branchId: user?.branch?.id,
				productCategory,
				productStatus: status,
				page: 1,
			},
			true,
		);

		setSearchedKeyword(value);
	};

	const onSelectProductCategory = (value) => {
		getBranchProducts(
			{
				search: searchedKeyword,
				branchId: user?.branch?.id,
				productCategory: value,
				productStatus: status,
				page: 1,
			},
			true,
		);

		setProductCategory(value);
	};

	const onSelectStatus = (value) => {
		getBranchProducts(
			{
				search: searchedKeyword,
				branchId: user?.branch?.id,
				productCategory,
				productStatus: value,
				page: 1,
			},
			true,
		);

		setStatus(value);
	};

	return (
		<Content title="Products">
			<Box>
				<TableHeader title="Products" />

				<div className="PaddingHorizontal">
					<RequestErrors
						errors={[
							...convertIntoArray(branchProductsErrors, 'Branch Product'),
							...convertIntoArray(productCategoriesErrors, 'Product Category'),
						]}
						withSpaceBottom
					/>

					<Filter
						productCategories={productCategories}
						productCategoriesStatus={productCategoriesStatus}
						onSelectProductCategory={onSelectProductCategory}
						onSelectStatus={onSelectStatus}
						onSearch={onSearch}
					/>
				</div>

				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 650 }}
					pagination={{
						current: currentPage,
						total: pageCount,
						pageSize,
						onChange: onPageChange,
						disabled: !data,
						position: ['bottomCenter'],
						pageSizeOptions,
					}}
					loading={branchProductsStatus === request.REQUESTING}
				/>

				{selectedBranchProduct && (
					<ViewProductModal
						branchProduct={selectedBranchProduct}
						onClose={() => setSelectedBranchProduct(null)}
					/>
				)}
			</Box>
		</Content>
	);
};

interface FilterProps {
	productCategories: IProductCategory[];
	productCategoriesStatus: number;
	onSelectProductCategory: any;
	onSelectStatus: any;
	onSearch: any;
}

const Filter = ({
	productCategories,
	productCategoriesStatus,
	onSelectProductCategory,
	onSelectStatus,
	onSearch,
}: FilterProps) => {
	const onSearchDebounced = useCallback(
		debounce((keyword) => {
			onSearch(keyword?.toLowerCase());
		}, SEARCH_DEBOUNCE_TIME),
		[onSearch],
	);

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					prefix={<SearchOutlined />}
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
					allowClear
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Product Category" spacing />
				<Select
					style={{ width: '100%' }}
					onChange={onSelectProductCategory}
					loading={productCategoriesStatus === request.REQUESTING}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					showSearch
					allowClear
				>
					{productCategories.map(({ name }) => (
						<Select.Option value={name}>{name}</Select.Option>
					))}
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Status" spacing />
				<Select
					style={{ width: '100%' }}
					onChange={onSelectStatus}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					showSearch
					allowClear
				>
					<Select.Option value={branchProductStatus.AVAILABLE}>
						Available
					</Select.Option>
					<Select.Option value={branchProductStatus.REORDER}>
						Reorder
					</Select.Option>
					<Select.Option value={branchProductStatus.OUT_OF_STOCK}>
						Out of Stock
					</Select.Option>
				</Select>
			</Col>
		</Row>
	);
};
