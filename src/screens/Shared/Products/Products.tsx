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
import { types } from '../../../ducks/OfficeManager/products';
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
		getProducts(
			{ search: searchedKeyword, productCategory, page, pageSize: newPageSize },
			newPageSize !== pageSize,
		);
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

	const onSearch = useCallback(
		debounce((keyword) => {
			const lowerCaseKeyword = keyword?.toLowerCase();

			getProducts({ search: lowerCaseKeyword, productCategory, page: 1 }, true);

			setSeachedKeyword(lowerCaseKeyword);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	const onSelectProductCategory = (value) => {
		setProductCategory(value);

		getProducts(
			{ search: searchedKeyword, productCategory: value, page: 1 },
			true,
		);
	};

	return (
		<Content className="Products" title="Products">
			<Box>
				<TableHeader buttonName="Create Product" onCreate={onCreate} />

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
					onSearch={onSearch}
					onSelectProductCategory={onSelectProductCategory}
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
					visible={createEditProductModalVisible}
					onFetchPendingTransactions={
						pendingTransactionsRef.current?.refreshList
					}
					onSuccess={() => {
						getProducts(
							{ search: searchedKeyword, productCategory, page: currentPage },
							true,
						);
					}}
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
}: FilterProps) => (
	<Row className="PaddingHorizontal" gutter={[15, 15]}>
		<Col lg={12} span={24}>
			<Label label="Search" spacing />
			<Input
				prefix={<SearchOutlined />}
				onChange={(event) => onSearch(event.target.value.trim())}
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
