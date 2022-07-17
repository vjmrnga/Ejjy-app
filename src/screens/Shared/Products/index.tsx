import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import {
	ConnectionAlert,
	Content,
	ModifyProductModal,
	PricesModal,
	RequestErrors,
	TableActions,
	TableHeader,
	ViewProductModal,
} from 'components';
import { Box, ButtonLink, Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	SEARCH_DEBOUNCE_TIME,
} from 'global';
import {
	usePingOnlineServer,
	useProductCategories,
	useProductDelete,
	useProducts,
	useQueryParams,
} from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	getBranchId,
	getId,
	isCUDShown,
} from 'utils';

const columns: ColumnsType = [
	{
		title: 'Barcode',
		dataIndex: 'barcode',
		width: 150,
		fixed: 'left',
	},
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Actions', dataIndex: 'actions' },
];

const modals = {
	VIEW: 0,
	MODIFY: 1,
	EDIT_PRICE_COST: 2,
};

export const Products = () => {
	// STATES
	const [modalType, setModalType] = useState(null);
	const [dataSource, setDataSource] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [hasPendingTransactions] = useState(false);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const { isConnected } = usePingOnlineServer();
	const { user } = useAuth();
	const {
		data: { products, total },
		isFetching: isProductsFetching,
		error: productsError,
	} = useProducts({
		params: {
			...params,
			branchId: getBranchId(),
		},
	});
	const { mutate: deleteProduct, error: deleteError } = useProductDelete();

	// METHODS
	useEffect(() => {
		const formattedProducts =
			products?.map((product) => {
				const { id, barcode, name, textcode } = product;

				return {
					key: id,
					barcode: (
						<ButtonLink
							text={barcode || textcode}
							onClick={() => onOpenModal(product, modals.VIEW)}
						/>
					),
					name,
					actions: hasPendingTransactions ? null : (
						<TableActions
							areButtonsDisabled={isConnected === false}
							onAdd={() => onOpenModal(product, modals.EDIT_PRICE_COST)}
							onAddIcon={require('assets/images/icon-money.svg')}
							onAddName="Set Prices"
							onEdit={
								isCUDShown(user.user_type)
									? () => onOpenModal(product, modals.MODIFY)
									: undefined
							}
							onRemove={
								isCUDShown(user.user_type)
									? () =>
											deleteProduct({
												id: getId(product),
												actingUserId: getId(user),
											})
									: undefined
							}
						/>
					),
				};
			}) || [];

		setDataSource(formattedProducts);
	}, [products, user, hasPendingTransactions, isConnected]);

	const onOpenModal = (product, type) => {
		setModalType(type);
		setSelectedProduct(product);
	};

	// NOTE: Temporarily disable the initial deletion of data
	// const onRemoveProduct = (product) => {
	// 	removeProduct(
	// 		{ id: product.id, actingUserId: user.id },
	// 		({ status, response }) => {
	// 			if (status === request.SUCCESS) {
	// 				if (response?.length) {
	// 					message.warning(
	// 						'We found an error while deleting the product details in local branch. Please check the pending transaction table below.',
	// 					);

	// 					pendingTransactionsRef.current?.refreshList();
	// 				}

	// 				refreshList();
	// 			}
	// 		},
	// 	);
	// };

	return (
		<Content title="Products">
			<ConnectionAlert />

			<Box>
				{isCUDShown(user.user_type) && (
					<TableHeader
						buttonName="Create Product"
						onCreate={() => onOpenModal(null, modals.MODIFY)}
						onCreateDisabled={isConnected === false}
					/>
				)}

				<RequestErrors
					className="px-6"
					errors={[
						...convertIntoArray(productsError, 'Product'),
						...convertIntoArray(deleteError?.errors, 'Product Delete'),
					]}
				/>

				<Filter />

				<Table
					columns={columns}
					dataSource={dataSource}
					loading={isProductsFetching}
					pagination={{
						current: Number(params.page) || DEFAULT_PAGE,
						total,
						pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
						onChange: (page, newPageSize) => {
							setQueryParams({
								page,
								pageSize: newPageSize,
							});
						},
						disabled: !dataSource,
						position: ['bottomCenter'],
						pageSizeOptions,
					}}
					scroll={{ x: 650 }}
				/>

				{modalType === modals.VIEW && selectedProduct && (
					<ViewProductModal
						product={selectedProduct}
						onClose={() => onOpenModal(null, null)}
					/>
				)}

				{modalType === modals.MODIFY && (
					<ModifyProductModal
						product={selectedProduct}
						onClose={() => onOpenModal(null, null)}
					/>
				)}

				{modalType === modals.EDIT_PRICE_COST && selectedProduct && (
					<PricesModal
						product={selectedProduct}
						onClose={() => onOpenModal(null, null)}
					/>
				)}
			</Box>

			{/* TODO: Temporarily hid the Pending Transactions section. Need to be revisited if this is still needed */}
			{/* {!isUserFromBranch(user.user_type) && (
				<PendingTransactionsSection
					ref={pendingTransactionsRef}
					title="Pending Product Transactions"
					transactionType={pendingTransactionTypes.PRODUCTS}
					setHasPendingTransactions={setHasPendingTransactions}
					withActionColumn
				/>
			)} */}
		</Content>
	);
};

const Filter = () => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { productCategories },
		isFetching: isFetchingProductCategories,
		error: productCategoriesErrors,
	} = useProductCategories({
		params: {
			pageSize: MAX_PAGE_SIZE,
		},
	});

	// METHODS
	const onSearchDebounced = useCallback(
		debounce((search) => {
			setQueryParams({ search }, { shouldResetPage: true });
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Row className="pa-6 pt-0" gutter={[16, 16]}>
			<Col span={24}>
				<RequestErrors
					errors={convertIntoArray(productCategoriesErrors, 'Product Category')}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					defaultValue={params.search}
					prefix={<SearchOutlined />}
					allowClear
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Category" spacing />
				<Select
					defaultValue={params.productCategory}
					filterOption={filterOption}
					loading={isFetchingProductCategories}
					optionFilterProp="children"
					style={{ width: '100%' }}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams(
							{ productCategory: value },
							{ shouldResetPage: true },
						);
					}}
				>
					{productCategories.map(({ id, name }) => (
						<Select.Option key={id} value={name}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>
		</Row>
	);
};
