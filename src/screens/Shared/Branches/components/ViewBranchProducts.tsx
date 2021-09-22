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
import { IProductCategory } from '../../../../models';
import { convertIntoArray, formatQuantity } from '../../../../utils/function';
import { AddBranchProductBalanceModal } from './BranchProducts/AddBranchProductBalanceModal';
import { EditBranchProductsModal } from './BranchProducts/EditBranchProductsModal';
import { ViewBranchProductModal } from './BranchProducts/ViewBranchProductModal';

const modals = {
	VIEW: 0,
	ADD: 1,
	EDIT: 2,
};

const columns: ColumnsType = [
	{ title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Balance', dataIndex: 'balance', key: 'balance' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

interface Props {
	branch: any;
}

export const ViewBranchProducts = ({ branch }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [productCategories, setProductCategories] = useState([]);
	const [modalType, setModalType] = useState(null);
	const [selectedBranchProduct, setSelectedBranchProduct] = useState(null);

	// NOTE: Hiding/showing of current balance is temporarily disabled as requested by Emman
	const [isCurrentBalanceVisible] = useState(true);

	// CUSTOM HOOKS
	const history = useHistory();
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

		// Set default values for filter query parameters
		const searchObj = queryString.parse(history.location.search);
		history.push(
			queryString.stringifyUrl({
				url: '',
				query: {
					isSoldInBranch: true,
					page: currentPage,
					pageSize,
					...searchObj,
				},
			}),
		);
	}, []);

	useEffect(() => {
		const formattedBranchProducts = branchProducts.map((branchProduct) => {
			const {
				id,
				product: { barcode, name, textcode, unit_of_measurement },
				current_balance,
				max_balance,
			} = branchProduct;

			const currentBalance = formatQuantity(
				unit_of_measurement,
				current_balance,
			);

			const maxBalance = formatQuantity(unit_of_measurement, max_balance);

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

	useEffect(() => {
		fetchBranchProducts();
	}, [history.location]);

	const fetchBranchProducts = () => {
		const searchObj = queryString.parse(history.location.search);

		const newPageSize = searchObj.pageSize || pageSize;
		let isSoldInBranch = null;
		if (searchObj.isSoldInBranch === 'true') {
			isSoldInBranch = true;
		} else if (searchObj.isSoldInBranch === 'false') {
			isSoldInBranch = false;
		}

		getBranchProducts(
			{
				...searchObj,
				isSoldInBranch,
				branchId: branch?.id,
				pageSize: newPageSize,
			},
			true,
		);
	};

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
				rowKey="key"
				columns={columns}
				dataSource={data}
				scroll={{ x: 800 }}
				pagination={{
					current: currentPage,
					total: pageCount,
					pageSize,
					onChange: (page, newPageSize) => {
						const searchObj = queryString.parse(history.location.search);
						history.push(
							queryString.stringifyUrl({
								url: '',
								query: {
									...searchObj,
									page,
									pageSize: newPageSize,
								},
							}),
						);
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
					branch={branch}
					branchProduct={selectedBranchProduct}
					refreshList={fetchBranchProducts}
					onClose={() => setModalType(null)}
				/>
			)}

			{selectedBranchProduct && modalType === modals.ADD && (
				<AddBranchProductBalanceModal
					branch={branch}
					branchProduct={selectedBranchProduct}
					refreshList={fetchBranchProducts}
					onClose={() => setModalType(null)}
				/>
			)}
		</div>
	);
};

interface FilterProps {
	productCategories: IProductCategory[];
	productCategoriesStatus: number;
}

const Filter = ({
	productCategories,
	productCategoriesStatus,
}: FilterProps) => {
	const history = useHistory();
	const searchObj = queryString.parse(history.location.search);

	// METHODS
	const onSearchDebounced = useCallback(
		debounce((keyword) => {
			onFilter({ search: keyword });
		}, SEARCH_DEBOUNCE_TIME),
		[searchObj],
	);

	const onFilter = (filter) => {
		history.push(
			queryString.stringifyUrl({
				url: '',
				query: {
					...searchObj,
					...filter,
				},
			}),
		);
	};

	return (
		<Row className="ViewBranchProducts_filter" gutter={[15, 15]}>
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
						onFilter({ productCategory: value });
					}}
					loading={productCategoriesStatus === request.REQUESTING}
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
						{ label: 'Show All', value: null },
						{ label: 'Show Not Sold', value: false },
						{ label: 'Show In Stock', value: true },
					]}
					onChange={(e) => {
						const { value } = e.target;
						onFilter({ isSoldInBranch: value });
					}}
					// eslint-disable-next-line react/jsx-boolean-value
					defaultValue={true}
					optionType="button"
				/>
			</Col>
		</Row>
	);
};
