import {
	DeleteOutlined,
	DollarOutlined,
	EditOutlined,
	PrinterOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import {
	Button,
	Col,
	Input,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Tooltip,
} from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import {
	ConnectionAlert,
	Content,
	ModifyProductModal,
	PricesModal,
	ProductsInfo,
	RequestErrors,
	TableHeader,
	ViewProductModal,
} from 'components';
import { Box, ButtonLink, Label } from 'components/elements';
import { printProductPriceTag } from 'configurePrinter';
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
import jsPDF from 'jspdf';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	getId,
	getLocalBranchId,
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
	const [isCreatingPdf, setIsCreatingPdf] = useState(false);
	const [html, setHtml] = useState('');

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const { isConnected } = usePingOnlineServer();
	const { user } = useAuth();
	const {
		data: { products, total },
		isFetching: isFetchingProducts,
		error: productsError,
	} = useProducts({
		params: {
			...params,
			branchId: getLocalBranchId(),
		},
	});
	const {
		mutate: deleteProduct,
		isLoading: isDeletingProduct,
		error: deleteError,
	} = useProductDelete();

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
							onClick={() => handleOpenModal(product, modals.VIEW)}
						/>
					),
					name,
					actions: hasPendingTransactions ? null : (
						<Space>
							<Tooltip title="Set Prices">
								<Button
									disabled={isConnected === false}
									icon={<DollarOutlined />}
									type="primary"
									onClick={() =>
										handleOpenModal(product, modals.EDIT_PRICE_COST)
									}
								/>
							</Tooltip>
							<Tooltip title="Edit">
								{isCUDShown(user.user_type) && (
									<Button
										disabled={isConnected === false}
										icon={<EditOutlined />}
										type="primary"
										onClick={() => handleOpenModal(product, modals.MODIFY)}
									/>
								)}
							</Tooltip>
							<Tooltip title="Print Price Tag">
								<Button
									disabled={isConnected === false}
									icon={<PrinterOutlined />}
									loading={isCreatingPdf === product.id}
									type="primary"
									onClick={() => {
										handleCreatePdf(product);
									}}
								/>
							</Tooltip>
							{isCUDShown(user.user_type) && (
								<Popconfirm
									cancelText="No"
									disabled={isConnected === false}
									okText="Yes"
									placement="left"
									title="Are you sure to remove this?"
									onConfirm={() =>
										deleteProduct({
											id: getId(product),
											actingUserId: getId(user),
										})
									}
								>
									<Tooltip title="Remove">
										<Button icon={<DeleteOutlined />} type="primary" danger />
									</Tooltip>
								</Popconfirm>
							)}
						</Space>
					),
				};
			}) || [];

		setDataSource(formattedProducts);
	}, [products, user, hasPendingTransactions, isConnected, isCreatingPdf]);

	const handleOpenModal = (product, type) => {
		setModalType(type);
		setSelectedProduct(product);
	};

	const handleCreatePdf = (product) => {
		setIsCreatingPdf(product.id);

		// eslint-disable-next-line new-cap
		const pdf = new jsPDF('l', 'px', [113.38582677, 75.590551181]);

		const dataHtml = printProductPriceTag(product);

		setHtml(dataHtml);

		setTimeout(() => {
			pdf.html(dataHtml, {
				margin: 0,
				filename: `ProductPriceTag_${product.print_details}`,
				callback: (instance) => {
					window.open(instance.output('bloburl').toString());
					setIsCreatingPdf(false);
					setHtml('');
				},
			});
		}, 500);
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
			<ProductsInfo />

			<ConnectionAlert />

			<Box>
				{isCUDShown(user.user_type) && (
					<TableHeader
						buttonName="Create Product"
						onCreate={() => handleOpenModal(null, modals.MODIFY)}
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
					loading={isFetchingProducts || isDeletingProduct}
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
						onClose={() => handleOpenModal(null, null)}
					/>
				)}

				{modalType === modals.MODIFY && (
					<ModifyProductModal
						product={selectedProduct}
						onClose={() => handleOpenModal(null, null)}
					/>
				)}

				{modalType === modals.EDIT_PRICE_COST && selectedProduct && (
					<PricesModal
						product={selectedProduct}
						onClose={() => handleOpenModal(null, null)}
					/>
				)}
			</Box>

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>

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
		_.debounce((search) => {
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
