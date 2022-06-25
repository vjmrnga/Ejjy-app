/* eslint-disable dot-notation */
import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Radio, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { debounce } from 'lodash';
import * as queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TableActions, TableHeader } from '../../../../components';
import { ButtonLink, Label } from '../../../../components/elements';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { RequestWarnings } from '../../../../components/RequestWarnings/RequestWarnings';
import { SEARCH_DEBOUNCE_TIME } from '../../../../global/constants';
import { pageSizeOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useProductCategories } from '../../../../hooks/useProductCategories';
import { useQueryParams } from 'hooks';
import { IProductCategory } from '../../../../models';
import { convertIntoArray, formatQuantity } from 'utils';
import { AddBranchProductBalanceModal } from './BranchProducts/AddBranchProductBalanceModal';
import { EditBranchProductsModal } from './BranchProducts/EditBranchProductsModal';
import { ViewBranchProductModal } from './BranchProducts/ViewBranchProductModal';

const modals = {
	VIEW: 0,
	ADD: 1,
	EDIT: 2,
};

const isSoldInBranchOptions = {
	SHOW_ALL: 'show_all',
	SHOW_NOT_SOLD: 'show_not_sold',
	SHOW_IN_STOCK: 'show_in_stocks',
};

const columns: ColumnsType = [
	{ title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Balance', dataIndex: 'balance', key: 'balance' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

interface Props {
	branchId: any;
}

export const ViewBranchProducts = ({ branchId }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [productCategories, setProductCategories] = useState([]);
	const [modalType, setModalType] = useState(null);
	const [selectedBranchProduct, setSelectedBranchProduct] = useState(null);

	// NOTE: Hiding/showing of current balance is temporarily disabled as requested by Emman
	const [isCurrentBalanceVisible] = useState(true);

	// CUSTOM HOOKS
	const {
		branchProducts,
		pageCount,
		pageSize,
		currentPage,

		getBranchProducts,
		status: branchProductsStatus,
		errors: branchProductsErrors,
		warnings,
	} = useBranchProducts();
	const {
		getProductCategories,
		status: productCategoriesStatus,
		errors: productCategoriesErrors,
	} = useProductCategories();

	const { refreshList, setQueryParams } = useQueryParams({
		page: currentPage,
		pageSize,
		onParamsCheck: (params) => {
			const newParams = {};

			if (!params.isSoldInBranch) {
				newParams['isSoldInBranch'] = isSoldInBranchOptions.SHOW_IN_STOCK;
			}

			if (!params.page) {
				newParams['page'] = 1;
			}

			return newParams;
		},
		onQueryParamChange: (params) => {
			let isSoldInBranch = null;
			if (params.isSoldInBranch === isSoldInBranchOptions.SHOW_IN_STOCK) {
				isSoldInBranch = true;
			} else if (
				params.isSoldInBranch === isSoldInBranchOptions.SHOW_NOT_SOLD
			) {
				isSoldInBranch = false;
			}

			getBranchProducts(
				{
					...params,
					isSoldInBranch,
					branchId,
				},
				true,
			);
		},
	});

	// NOTE: Hiding/showing of current balance is temporarily disabled as requested by Emman
	// useEffect(() => {
	// 	document.addEventListener('keydown', handleKeyDown);

	// 	return () => {
	// 		document.removeEventListener('keydown', handleKeyDown);
	// 	};
	// });

	// METHODS
	useEffect(() => {
		getProductCategories(({ status, data: responseData }) => {
			if (status === request.SUCCESS) {
				setProductCategories(responseData);
			}
		});
	}, []);

	useEffect(() => {
		const formattedBranchProducts = branchProducts.map((branchProduct) => {
			const {
				id,
				product: { barcode, name, textcode, unit_of_measurement },
				current_balance,
				max_balance,
			} = branchProduct;

			const currentBalance = formatQuantity({
				unitOfMeasurement: unit_of_measurement,
				quantity: current_balance,
			});

			const maxBalance = formatQuantity({
				unitOfMeasurement: unit_of_measurement,
				quantity: max_balance,
			});

			return {
				key: id,
				barcode: (
					<ButtonLink
						text={barcode || textcode}
						onClick={() => {
							setSelectedBranchProduct(branchProduct);
							setModalType(modals.VIEW);
						}}
					/>
				),
				name,
				balance: `${
					isCurrentBalanceVisible ? currentBalance : '???'
				} / ${maxBalance}`,
				actions: (
					<TableActions
						onAddName="Supplier Delivery"
						onAdd={() => {
							setSelectedBranchProduct(branchProduct);
							setModalType(modals.ADD);
						}}
						onEdit={() => {
							setSelectedBranchProduct(branchProduct);
							setModalType(modals.EDIT);
						}}
					/>
				),
			};
		});

		setData(formattedBranchProducts);
	}, [branchProducts]);

	// NOTE: Hiding/showing of current balance is temporarily disabled as requested by Emman
	// const handleKeyDown = (event) => {
	// 	const key = getKeyDownCombination(event);

	// 	if (SHOW_HIDE_SHORTCUT.includes(key) && modalType !== null) {
	// 		event.preventDefault();

	// 		if (isCurrentBalanceVisible) {
	// 			setIsCurrentBalanceVisible(false);
	// 		} else {
	// 			confirmPassword({
	// 				onSuccess: () => setIsCurrentBalanceVisible(true),
	// 			});
	// 		}
	// 	}
	// };

	return (
		<div className="ViewBranchProducts">
			<TableHeader title="Products" buttonName="Create Branch Product" />

			<Filter
				productCategoriesStatus={productCategoriesStatus}
				productCategories={productCategories}
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
			/>

			<RequestErrors
				errors={[
					...convertIntoArray(branchProductsErrors, 'Branch Product'),
					...convertIntoArray(productCategoriesErrors, 'Product Category'),
				]}
				withSpaceTop
				withSpaceBottom
			/>
			<RequestWarnings warnings={convertIntoArray(warnings)} withSpaceBottom />

			<Table
				columns={columns}
				dataSource={data}
				scroll={{ x: 800 }}
				pagination={{
					current: currentPage,
					total: pageCount,
					pageSize,
					onChange: (page, newPageSize) => {
						setQueryParams({
							page,
							pageSize: newPageSize,
						});
					},
					disabled: !data,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				loading={branchProductsStatus === request.REQUESTING}
			/>

			{selectedBranchProduct && modalType === modals.VIEW && (
				<ViewBranchProductModal
					branchProduct={selectedBranchProduct}
					onClose={() => setModalType(null)}
				/>
			)}

			{selectedBranchProduct && modalType === modals.EDIT && (
				<EditBranchProductsModal
					branchId={branchId}
					branchProduct={selectedBranchProduct}
					onSuccess={refreshList}
					onClose={() => setModalType(null)}
				/>
			)}

			{selectedBranchProduct && modalType === modals.ADD && (
				<AddBranchProductBalanceModal
					branchId={branchId}
					branchProduct={selectedBranchProduct}
					onSuccess={refreshList}
					onClose={() => setModalType(null)}
				/>
			)}
		</div>
	);
};

interface FilterProps {
	productCategories: IProductCategory[];
	productCategoriesStatus: number;
	setQueryParams: any;
}

const Filter = ({
	productCategories,
	productCategoriesStatus,
	setQueryParams,
}: FilterProps) => {
	const history = useHistory();
	const searchObj = queryString.parse(history.location.search);

	// METHODS
	const onSearchDebounced = useCallback(
		debounce((keyword) => {
			setQueryParams({ search: keyword });
		}, SEARCH_DEBOUNCE_TIME),
		[searchObj],
	);

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					prefix={<SearchOutlined />}
					defaultValue={searchObj.search}
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
					allowClear
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Product Category" spacing />
				<Select
					style={{ width: '100%' }}
					value={searchObj.productCategory}
					onChange={(value) => {
						setQueryParams({ productCategory: value });
					}}
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
						<Select.Option key={name} value={name}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Show Sold In Branch" spacing />
				<Radio.Group
					value={searchObj.isSoldInBranch}
					options={[
						{ label: 'Show All', value: isSoldInBranchOptions.SHOW_ALL },
						{
							label: 'Show Not Sold',
							value: isSoldInBranchOptions.SHOW_NOT_SOLD,
						},
						{
							label: 'Show In Stock',
							value: isSoldInBranchOptions.SHOW_IN_STOCK,
						},
					]}
					onChange={(e) => {
						const { value } = e.target;
						setQueryParams({ isSoldInBranch: value });
					}}
					optionType="button"
				/>
			</Col>
		</Row>
	);
};
