import { Col, message, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import React, { useEffect, useRef, useState } from 'react';
import {
	Content,
	RequestErrors,
	TableActions,
	TableHeader,
} from '../../../components';
import { Box, ButtonLink, Label } from '../../../components/elements';
import { PendingTransactionsSection } from '../../../components/PendingTransactionsSection/PendingTransactionsSection';
import { types } from '../../../ducks/OfficeManager/products';
import { pageSizeOptions } from '../../../global/options';
import { pendingTransactionTypes, request } from '../../../global/types';
import { useProductCategories } from '../../../hooks/useProductCategories';
import { useProducts } from '../../../hooks/useProducts';
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

export const Products = () => {
	// STATES
	const [data, setData] = useState([]);
	const [createEditProductModalVisible, setCreateEditProductModalVisible] =
		useState(false);
	const [viewProductModalVisible, setViewProductModalVisible] = useState(false);
	const [editPriceCostModalVisible, setEditPriceCostModalVisible] =
		useState(false);
	const [productCategories, setProductCategories] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [hasPendingTransactions, setHasPendingTransactions] = useState(false);
	const [productCategory, setProductCategory] = useState(null);
	const [searchedKeyword, setSeachedKeyword] = useState('');

	// REFS
	const pendingTransactionsRef = useRef(null);

	// CUSTOM HOOKS
	const {
		products,
		pageCount,
		pageSize,
		currentPage,
		addItemInPagination,
		updateItemInPagination,
		removeItemInPagination,

		getProducts,
		removeProduct,
		status: productsStatus,
		errors: productsErrors,
		recentRequest,
	} = useProducts();
	const {
		getProductCategories,
		status: productCategoriesStatus,
		errors: productCategoriesErrors,
	} = useProductCategories();

	// METHODS
	useEffect(() => {
		getProducts({ page: 1 });
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
							onClick={() => onView(product)}
						/>
					),
					name,
					actions: hasPendingTransactions ? null : (
						<TableActions
							onAddName="Edit Price and Cost"
							onAddIcon={require('../../../assets/images/icon-money.svg')}
							onAdd={() => onEditPriceCost(product)}
							onEdit={() => onEdit(product)}
							onRemove={() => onRemoveProduct(product)}
						/>
					),
				};
			}) || [];

		setData(formattedProducts);
	}, [products, hasPendingTransactions]);

	const onPageChange = (page, newPageSize) => {
		getProducts({ page, pageSize: newPageSize }, newPageSize !== pageSize);
	};

	const onView = (product) => {
		setSelectedProduct(product);
		setViewProductModalVisible(true);
	};

	const onCreate = () => {
		setSelectedProduct(null);
		setCreateEditProductModalVisible(true);
	};

	const onEdit = (product) => {
		setSelectedProduct(product);
		setCreateEditProductModalVisible(true);
	};

	const onEditPriceCost = (product) => {
		setSelectedProduct(product);
		setEditPriceCostModalVisible(true);
	};

	const onSearch = (keyword) => {
		const lowerCaseKeyword = keyword?.toLowerCase();

		getProducts({ search: lowerCaseKeyword, productCategory, page: 1 }, true);

		setSeachedKeyword(lowerCaseKeyword);
	};

	const onRemoveProduct = (product) => {
		removeProduct(product.id, ({ status, response }) => {
			if (status === request.SUCCESS) {
				if (response?.length) {
					message.warning(
						'We found an error while deleting the product details in local branch. Please check the pending transaction table below.',
					);

					pendingTransactionsRef.current?.refreshList();
				}

				removeItemInPagination(product);
			}
		});
	};

	return (
		<Content className="Products" title="Products">
			<Box>
				<TableHeader
					buttonName="Create Product"
					onSearch={onSearch}
					onCreate={onCreate}
				/>

				<RequestErrors
					className="PaddingHorizontal"
					errors={[
						...convertIntoArray(productsErrors, 'Product'),
						...convertIntoArray(productCategoriesErrors, 'Product Category'),
					]}
					withSpaceBottom
				/>

				<Row className="PaddingHorizontal" gutter={[15, 15]}>
					<Col lg={12} span={24}>
						<Label label="Product Category" spacing />
						<Select
							style={{ width: '100%' }}
							onChange={(value) => {
								setProductCategory(value);

								getProducts(
									{ search: searchedKeyword, productCategory: value, page: 1 },
									true,
								);
							}}
							loading={productCategoriesStatus === request.REQUESTING}
							allowClear
						>
							{productCategories.map(({ name }) => (
								<Select.Option value={name}>{name}</Select.Option>
							))}
						</Select>
					</Col>
				</Row>

				<Table
					className="Products_table"
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
					loading={
						productsStatus === request.REQUESTING &&
						recentRequest !== types.GET_PRODUCTS
					}
				/>

				<ViewProductModal
					product={selectedProduct}
					visible={viewProductModalVisible}
					onClose={() => setViewProductModalVisible(false)}
				/>

				<CreateEditProductModal
					product={selectedProduct}
					productCategories={productCategories}
					addItemInPagination={addItemInPagination}
					updateItemInPagination={updateItemInPagination}
					visible={createEditProductModalVisible}
					onFetchPendingTransactions={
						pendingTransactionsRef.current?.refreshList
					}
					onClose={() => setCreateEditProductModalVisible(false)}
				/>

				<EditPriceCostModal
					product={selectedProduct}
					visible={editPriceCostModalVisible}
					onClose={() => setEditPriceCostModalVisible(false)}
				/>
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
