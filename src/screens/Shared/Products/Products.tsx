import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, message, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { debounce } from 'lodash';
import * as queryString from 'query-string';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	Content,
	RequestErrors,
	TableActions,
	TableHeader,
} from '../../../components';
import { Box, ButtonLink, Label } from '../../../components/elements';
import { PendingTransactionsSection } from '../../../components/PendingTransactionsSection/PendingTransactionsSection';
import { SEARCH_DEBOUNCE_TIME } from '../../../global/constants';
import { pageSizeOptions } from '../../../global/options';
import { pendingTransactionTypes, request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useProductCategories } from '../../../hooks/useProductCategories';
import { useProducts } from '../../../hooks/useProducts';
import { IProductCategory } from '../../../models';
import { convertIntoArray } from '../../../utils/function';
import { CreateEditProductModal } from './components/CreateEditProductModal';
import { EditPriceCostModal } from './components/EditPriceCostModal';
import { ViewProductModal } from './components/ViewProductModal';

const columns: ColumnsType = [
	{
		title: 'Barcode',
		dataIndex: 'barcode',
		key: 'barcode',
		width: 150,
		fixed: 'left',
	},
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

const modals = {
	VIEW: 0,
	CREATE_EDIT: 1,
	EDIT_PRICE_COST: 2,
};

export const Products = () => {
	// STATES
	const [data, setData] = useState([]);
	const [modalType, setModalType] = useState(null);
	const [productCategories, setProductCategories] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [hasPendingTransactions, setHasPendingTransactions] = useState(false);

	// REFS
	const pendingTransactionsRef = useRef(null);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const {
		products,
		pageCount,
		pageSize,
		currentPage,

		getProducts,
		removeProduct,
		status: productsStatus,
		errors: productsErrors,
	} = useProducts();
	const {
		getProductCategories,
		status: productCategoriesStatus,
		errors: productCategoriesErrors,
	} = useProductCategories();

	// METHODS
	useEffect(() => {
		getProductCategories(({ status, data: responseData }) => {
			if (status === request.SUCCESS) {
				setProductCategories(responseData);
			}
		});
	}, []);

	useEffect(() => {
		const formattedProducts =
			products?.map((product) => {
				const { barcode, name, textcode } = product;

				return {
					barcode: (
						<ButtonLink
							text={barcode || textcode}
							onClick={() => onOpenModal(product, modals.VIEW)}
						/>
					),
					name,
					actions: hasPendingTransactions ? null : (
						<TableActions
							onAddName="Edit Price and Cost"
							onAddIcon={require('../../../assets/images/icon-money.svg')}
							onAdd={() => onOpenModal(product, modals.EDIT_PRICE_COST)}
							onEdit={() => onOpenModal(product, modals.CREATE_EDIT)}
							onRemove={() => onRemoveProduct(product)}
						/>
					),
				};
			}) || [];

		setData(formattedProducts);
	}, [products, hasPendingTransactions]);

	useEffect(() => {
		fetchProducts();
	}, [history.location]);

	const onOpenModal = (product, type) => {
		setModalType(type);
		setSelectedProduct(product);
	};

	const onRemoveProduct = (product) => {
		removeProduct(
			{ id: product.id, actingUserId: user.id },
			({ status, response }) => {
				if (status === request.SUCCESS) {
					if (response?.length) {
						message.warning(
							'We found an error while deleting the product details in local branch. Please check the pending transaction table below.',
						);

						pendingTransactionsRef.current?.refreshList();
					}
					fetchProducts();
				}
			},
		);
	};

	const fetchProducts = () => {
		const searchObj = queryString.parse(history.location.search);
		const newPageSize = searchObj.pageSize || pageSize;
		const page = searchObj.page || currentPage;

		getProducts({ ...searchObj, page, pageSize: newPageSize }, true);
	};

	return (
		<Content className="Products" title="Products">
			<Box>
				<TableHeader
					buttonName="Create Product"
					onCreate={() => {
						onOpenModal(null, modals.CREATE_EDIT);
					}}
				/>

				<RequestErrors
					className="PaddingHorizontal"
					errors={[
						...convertIntoArray(productsErrors, 'Product'),
						...convertIntoArray(productCategoriesErrors, 'Product Category'),
					]}
					withSpaceBottom
				/>

				<Filter
					productCategories={productCategories}
					productCategoriesLoading={
						productCategoriesStatus === request.REQUESTING
					}
				/>

				<Table
					className="Products_table"
					columns={columns}
					dataSource={data}
					scroll={{ x: 650 }}
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
					loading={productsStatus === request.REQUESTING}
				/>

				{modalType === modals.VIEW && selectedProduct && (
					<ViewProductModal
						product={selectedProduct}
						onClose={() => onOpenModal(null, null)}
					/>
				)}

				{modalType === modals.CREATE_EDIT && (
					<CreateEditProductModal
						product={selectedProduct}
						productCategories={productCategories}
						onFetchPendingTransactions={
							pendingTransactionsRef.current?.refreshList
						}
						onSuccess={fetchProducts}
						onClose={() => onOpenModal(null, null)}
					/>
				)}

				{modalType === modals.EDIT_PRICE_COST && selectedProduct && (
					<EditPriceCostModal
						product={selectedProduct}
						onClose={() => onOpenModal(null, null)}
					/>
				)}
			</Box>

			<PendingTransactionsSection
				ref={pendingTransactionsRef}
				title="Pending Product Transactions"
				transactionType={pendingTransactionTypes.PRODUCTS}
				setHasPendingTransactions={setHasPendingTransactions}
				withActionColumn
			/>
		</Content>
	);
};

interface FilterProps {
	productCategories: IProductCategory[];
	productCategoriesLoading: boolean;
}

const Filter = ({
	productCategories,
	productCategoriesLoading,
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
		<Row className="PaddingHorizontal" gutter={[15, 15]}>
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
				<Label label="Category" spacing />
				<Select
					style={{ width: '100%' }}
					defaultValue={searchObj.productCategory}
					onChange={(value) => {
						onFilter({ productCategory: value });
					}}
					loading={productCategoriesLoading}
					allowClear
				>
					{productCategories.map(({ name }) => (
						<Select.Option value={name}>{name}</Select.Option>
					))}
				</Select>
			</Col>
		</Row>
	);
};
