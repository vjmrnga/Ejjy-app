/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { message, Table } from 'antd';
import { Container, TableActions, TableHeader } from 'components';
import { Box, ButtonLink } from 'components/elements';
import { PendingTransactionsSection } from 'components/PendingTransactionsSection/PendingTransactionsSection';
import { types as pendingTransactionsTypes } from 'ducks/OfficeManager/pending-transactions';
import { types } from 'ducks/OfficeManager/products';
import { pendingTransactionTypes, request } from 'global/types';
import { usePendingTransactions } from 'hooks/usePendingTransactions';
import { useProducts } from 'hooks/useProducts';
import { CreateEditProductModal } from './components/CreateEditProductModal';
import { EditPriceCostModal } from './components/EditPriceCostModal';
import { ViewProductModal } from './components/ViewProductModal';
import { pageSizeOptions } from 'global/options';

const columns = [
	{ title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

const Products = () => {
	// STATES
	const [data, setData] = useState([]);
	const [createEditProductModalVisible, setCreateEditProductModalVisible] = useState(false);
	const [viewProductModalVisible, setViewProductModalVisible] = useState(false);
	const [editPriceCostModalVisible, setEditPriceCostModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

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
		status: productStatus,
		recentRequest,
	} = useProducts();

	const {
		pendingTransactions,
		listPendingTransactions,
		status: pendingTransactionsStatus,
		recentRequest: pendingTransactionRecentRequest,
	} = usePendingTransactions();

	useEffect(() => {
		getProducts({ page: 1 });
	}, []);

	// METHODS
	// Effect: Format products to be rendered in Table
	useEffect(() => {
		let hasPendingTransactions = pendingTransactions.some(
			({ request_model }) => request_model === pendingTransactionTypes.PRODUCTS,
		);

		const formattedProducts =
			products?.map((product) => {
				const { barcode, name, textcode } = product;

				return {
					barcode: <ButtonLink text={barcode || textcode} onClick={() => onView(product)} />,
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
	}, [products, pendingTransactions]);

	const getFetchLoading = useCallback(
		() =>
			(productStatus === request.REQUESTING && recentRequest === types.GET_PRODUCTS) ||
			(pendingTransactionsStatus === request.REQUESTING &&
				pendingTransactionRecentRequest === pendingTransactionsTypes.LIST_PENDING_TRANSACTIONS),
		[productStatus, pendingTransactionsStatus, recentRequest, pendingTransactionRecentRequest],
	);

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
		keyword = keyword?.toLowerCase();
		getProducts({ search: keyword, page: 1 }, true);
	};

	const onRemoveProduct = (product) => {
		removeProduct(product.id, ({ status, response }) => {
			if (status === request.SUCCESS) {
				if (response?.length) {
					message.warning(
						'We found an error while deleting the product details in local branch. Please check the pending transaction table below.',
					);
					listPendingTransactions(null);
				}

				removeItemInPagination(product);
			}
		});
	};

	return (
		<Container title="Products" loading={getFetchLoading()} loadingText="Fetching data...">
			<section className="Products">
				<Box>
					<TableHeader buttonName="Create Product" onSearch={onSearch} onCreate={onCreate} />

					<Table
						columns={columns}
						dataSource={data}
						pagination={{
							current: currentPage,
							total: pageCount,
							pageSize: pageSize,
							onChange: onPageChange,
							disabled: !data,
							position: ['bottomCenter'],
							pageSizeOptions: pageSizeOptions
						}}
						loading={productStatus === request.REQUESTING && recentRequest !== types.GET_PRODUCTS}
					/>

					<ViewProductModal
						product={selectedProduct}
						visible={viewProductModalVisible}
						onClose={() => setViewProductModalVisible(false)}
					/>

					<CreateEditProductModal
						product={selectedProduct}
						addItemInPagination={addItemInPagination}
						updateItemInPagination={updateItemInPagination}
						visible={createEditProductModalVisible}
						onFetchPendingTransactions={listPendingTransactions}
						onClose={() => setCreateEditProductModalVisible(false)}
					/>

					<EditPriceCostModal
						product={selectedProduct}
						visible={editPriceCostModalVisible}
						onClose={() => setEditPriceCostModalVisible(false)}
					/>
				</Box>
			</section>

			<PendingTransactionsSection
				title="Pending Product Transactions"
				transactionType={pendingTransactionTypes.PRODUCTS}
			/>
		</Container>
	);
};

export default Products;
