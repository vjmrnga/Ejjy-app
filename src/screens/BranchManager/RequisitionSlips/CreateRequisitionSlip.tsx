/* eslint-disable no-mixed-spaces-and-tabs */
import { Divider, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ErrorMessage, Form, Formik } from 'formik';
import { isEmpty, toString } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Content, RequestErrors, TableHeader } from '../../../components';
import {
	Box,
	Button,
	FieldError,
	FormCheckbox,
	FormInput,
	FormSelect,
} from '../../../components/elements';
import {
	branchProductStatusOptionsWithAll,
	pageSizeOptions,
	quantityTypeOptions,
} from '../../../global/options';
import {
	branchProductStatus,
	quantityTypes,
	request,
	requisitionSlipTypes,
} from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import { useRequisitionSlips } from '../../../hooks/useRequisitionSlips';
import {
	convertIntoArray,
	convertToPieces,
	getBranchProductStatus,
	sleep,
} from '../../../utils/function';

const tabs = {
	ALL: 'ALL',
	SELECTED: 'SELECTED',
};

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: 200 },
	{ title: 'Status', dataIndex: 'status', key: 'status' },
];

export const CreateRequisitionSlip = () => {
	// STATES
	const [searchedKeyword, setSeachedKeyword] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [activeTab, setActiveTab] = useState(tabs.ALL);
	const [count, setCount] = useState(0);
	const [isSubmitting, setSubmitting] = useState(false);

	// REFS
	const formRef = useRef(null);
	const productsRef = useRef({});

	// CUSTOM HOOKS
	const history = useHistory();
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
		createRequisitionSlip,
		status: requisitionSlipsStatus,
		errors: requisitionSlipsErrors,
	} = useRequisitionSlips();

	// VARIABLES
	const branchId = user?.branch?.id;

	// METHODS
	useEffect(() => {
		getBranchProducts({ branchId, page: 1 });
	}, []);

	useEffect(() => {
		// Get existing keys
		const productKeys = Object.keys(productsRef.current);

		// Get new keys
		const newProducts = {};
		branchProducts
			.filter(
				({ product_status, product }) =>
					product_status !== branchProductStatus.AVAILABLE &&
					!productKeys.includes(toString(product.id)),
			)
			.forEach(({ product, product_status }) => {
				newProducts[product.id] = {
					name: product?.name,
					status: product_status,
					piecesInBulk: product.pieces_in_bulk,
					quantityType: quantityTypes.PIECE,
				};
			});

		productsRef.current = {
			...productsRef.current,
			...newProducts,
		};

		setCount(Object.keys(productsRef.current).length);
	}, [branchProducts]);

	// METHODS: Form methods
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchProducts:
					activeTab === tabs.ALL
						? branchProducts.map((branchProduct) => {
								const key = branchProduct.product.id;
								const product = productsRef.current?.[key];

								return {
									selected: key in productsRef.current,
									product_id: key,
									product_name: branchProduct.product.name,
									quantity: product?.quantity || '',
									quantity_type: product?.quantityType || quantityTypes.PIECE,
									pieces_in_bulk: branchProduct.product.pieces_in_bulk,
									status: branchProduct.product_status,
								};
						  })
						: Object.keys(productsRef.current).map((key) => {
								const product = productsRef.current[key];

								return {
									selected: true,
									product_id: key,
									product_name: product.name,
									quantity: product.quantity || '',
									quantity_type: product.quantityType,
									pieces_in_bulk: product.piecesInBulk,
									status: product.status,
								};
						  }),
			},
			Schema: Yup.object().shape({
				branchProducts: Yup.array().of(
					Yup.object().shape({
						selected: Yup.boolean(),
						quantity: Yup.number()
							.min(1, 'Must greater than zero')
							.when('selected', {
								is: true,
								then: Yup.number().required('Qty required'),
								otherwise: Yup.number().notRequired(),
							}),
					}),
				),
			}),
		}),
		[branchProducts, activeTab],
	);

	const renderQuantity = (fieldKey, product) => {
		const { selected = null, product_id: productId = null } = product;

		return (
			<>
				<div className="QuantityContainer">
					<FormInput
						type="number"
						id={`${fieldKey}.quantity`}
						onChange={(value) => {
							onChangeQuantity(productId, value);
						}}
						disabled={!selected}
					/>
					<FormSelect
						id={`${fieldKey}.quantity_type`}
						options={quantityTypeOptions}
						onChange={(value) => {
							onChangeQuantityType(productId, value);
						}}
						disabled={!selected}
					/>
				</div>
				<ErrorMessage
					name={`${fieldKey}.quantity`}
					render={(error) => <FieldError error={error} />}
				/>
			</>
		);
	};

	// METHODS: Change listeners
	const onChangeCheckbox = (productId, value, data = {}) => {
		if (value) {
			productsRef.current[productId] = data;
		} else {
			delete productsRef.current[productId];
		}

		setCount(Object.keys(productsRef.current).length);
	};

	const onChangeQuantity = (productId, value) => {
		if (productId in productsRef.current) {
			productsRef.current[productId].quantity = value;
		}
	};

	const onChangeQuantityType = (productId, value) => {
		if (productId in productsRef.current) {
			productsRef.current[productId].quantityType = value;
		}
	};

	// METHODS: Filters
	const onPageChange = (page, newPageSize) => {
		getBranchProducts(
			{
				branchId,
				search: searchedKeyword,
				productStatus: selectedStatus === 'all' ? null : selectedStatus,
				isSoldInBranch: true,
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	const onSearch = (keyword) => {
		const lowerCaseKeyword = keyword?.toLowerCase();

		getBranchProducts(
			{
				branchId,
				search: lowerCaseKeyword,
				productStatus: selectedStatus === 'all' ? null : selectedStatus,
				isSoldInBranch: true,
				page: 1,
			},
			true,
		);

		setSeachedKeyword(lowerCaseKeyword);
	};

	const onCreate = () => {
		const productIds = Object.keys(productsRef.current);

		if (productIds.length > 0) {
			const products = productIds.map((id) => {
				const { piecesInBulk, quantityType, quantity } =
					productsRef.current[id];

				return {
					product_id: id,
					quantity_piece:
						quantityType === quantityTypes.PIECE
							? quantity
							: convertToPieces(quantity, piecesInBulk),
				};
			});

			createRequisitionSlip(
				{
					requestor_id: user?.branch?.id,
					requesting_user_id: user?.id,
					type: requisitionSlipTypes.MANUAL,
					products,
				},
				({ status }) => {
					if (status === request.SUCCESS) {
						history.push('/branch-manager/requisition-slips');
					}
				},
			);
		}
	};

	const loading = [requisitionSlipsStatus, branchProductsStatus].includes(
		request.REQUESTING,
	);

	return (
		<Content className="CreateRequisitionSlip" title="Create Requisition Slips">
			<Box>
				<TableHeader
					title="Create Requisition Slip"
					onSearch={onSearch}
					statuses={branchProductStatusOptionsWithAll}
					onStatusSelect={(status) => {
						getBranchProducts(
							{
								branchId: user?.branch?.id,
								search: searchedKeyword,
								productStatus: status === 'all' ? null : status,
								isSoldInBranch: true,
								page: 1,
							},
							true,
						);
						setSelectedStatus(status);
					}}
					statusDisabled={activeTab === tabs.SELECTED}
					searchDisabled={activeTab === tabs.SELECTED}
				/>

				<div className="PaddingHorizontal">
					<RequestErrors
						errors={[
							...convertIntoArray(branchProductsErrors, 'Branch Products'),
							...convertIntoArray(requisitionSlipsErrors, 'Requisition Slip'),
						]}
						withSpaceBottom
					/>
				</div>

				<Formik
					innerRef={formRef}
					initialValues={getFormDetails().DefaultValues}
					validationSchema={getFormDetails().Schema}
					onSubmit={async () => {
						setSubmitting(true);
						await sleep(500);
						setSubmitting(false);

						onCreate();
					}}
					enableReinitialize
				>
					{({ values, setFieldValue }) => (
						<Form className="form">
							<div className="PaddingHorizontal">
								<Tabs
									type="card"
									activeKey={activeTab}
									onTabClick={setActiveTab}
								>
									<Tabs.TabPane key={tabs.ALL} tab="All Products" />
									<Tabs.TabPane
										key={tabs.SELECTED}
										tab={`Selected Products (${count})`}
									/>
								</Tabs>

								<ProductsTable
									activeTab={activeTab}
									branchProducts={branchProducts}
									formProps={{
										values,
										setFieldValue,
										renderQuantity,
										onChangeCheckbox,
									}}
									paginationProps={{
										currentPage,
										pageCount,
										pageSize,
										onPageChange,
									}}
									loading={loading || isSubmitting}
								/>
							</div>

							<Divider dashed />

							<div className="CreateRequisitionSlip_createContainer">
								<Button
									classNames="CreateRequisitionSlip_btnCreate"
									type="submit"
									text="Create"
									variant="primary"
									disabled={
										loading || isSubmitting || isEmpty(productsRef.current)
									}
								/>
							</div>
						</Form>
					)}
				</Formik>
			</Box>
		</Content>
	);
};

const ProductsTable = ({
	activeTab,
	formProps,
	paginationProps,
	loading,
}: any) => {
	// STATES
	const [data, setData] = useState([]);

	// VARIABLES
	const { values, setFieldValue, renderQuantity, onChangeCheckbox } = formProps;
	const { currentPage, pageCount, pageSize, onPageChange } = paginationProps;

	useEffect(() => {
		setData(
			values.branchProducts.map((product, index) => {
				const fieldKey = `branchProducts.${index}`;

				return {
					name: (
						<FormCheckbox
							id={`${fieldKey}.selected`}
							label={product.product_name}
							onChange={(value) => {
								if (!value && activeTab === tabs.ALL) {
									setFieldValue(`${fieldKey}.quantity`, '');
									setFieldValue(
										`${fieldKey}.quantity_type`,
										quantityTypes.PIECE,
									);
								} else if (!value && activeTab === tabs.SELECTED) {
									const newValues = values.branchProducts.filter(
										({ product_id }) => product_id !== product.product_id,
									);
									setFieldValue('branchProducts', newValues);
								}

								onChangeCheckbox(product.product_id, value, {
									name: product.product_name,
									status: product.status,
									quantityType: quantityTypes.PIECE,
									piecesInBulk: product.pieces_in_bulk,
								});
							}}
						/>
					),
					quantity: renderQuantity(fieldKey, product),
					status: getBranchProductStatus(product.status),
				};
			}),
		);
	}, [values]);

	return (
		<>
			<Table
				columns={columns}
				dataSource={data}
				pagination={
					activeTab === tabs.ALL
						? {
								current: currentPage,
								total: pageCount,
								pageSize,
								onChange: onPageChange,
								disabled: loading,
								position: ['bottomCenter'],
								pageSizeOptions,
						  }
						: false
				}
				loading={loading}
			/>
		</>
	);
};