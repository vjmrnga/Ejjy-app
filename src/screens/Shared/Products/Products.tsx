import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, message, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
	const [productCategory, setProductCategory] = useState(null);
	const [searchedKeyword, setSeachedKeyword] = useState('');

	// REFS
	const pendingTransactionsRef = useRef(null);

	// CUSTOM HOOKS
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
		getProducts({ search: searchedKeyword, productCategory, page: 1 }, true);
	}, [searchedKeyword, productCategory]);

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
					getProducts(
						{ search: searchedKeyword, productCategory, page: currentPage },
						true,
					);
				}
			},
		);
	};

	const onPageChange = (page, newPageSize) => {
		getProducts(
			{ search: searchedKeyword, productCategory, page, pageSize: newPageSize },
			newPageSize !== pageSize,
		);
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
					onSearch={setSeachedKeyword}
					onSelectProductCategory={setProductCategory}
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
						onChange: onPageChange,
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
						onSuccess={() => {
							getProducts(
								{ search: searchedKeyword, productCategory, page: currentPage },
								true,
							);
						}}
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
	onSearch: any;
	onSelectProductCategory: any;
}

const Filter = ({
	productCategories,
	productCategoriesLoading,
	onSearch,
	onSelectProductCategory,
}: FilterProps) => {
	const onSearchDebounced = useCallback(
		debounce((keyword) => {
			onSearch(keyword?.toLowerCase());
		}, SEARCH_DEBOUNCE_TIME),
		[onSearch],
	);

	return (
		<Row className="PaddingHorizontal" gutter={[15, 15]}>
			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					prefix={<SearchOutlined />}
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
					allowClear
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Category" spacing />
				<Select
					style={{ width: '100%' }}
					onChange={(value) => {
						onSelectProductCategory(value);
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
