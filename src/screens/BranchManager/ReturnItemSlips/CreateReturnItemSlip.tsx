/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-mixed-spaces-and-tabs */
import { Divider, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ErrorMessage, Form, Formik } from 'formik';
import { isEmpty, isInteger } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	convertIntoArray,
	convertToPieces,
	getBranchProductStatus,
	sleep,
} from 'utils';
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
	quantityTypes,
	request,
	unitOfMeasurementTypes,
} from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import { useReturnItemSlips } from '../../../hooks/useReturnItemSlips';

const tabs = {
	ALL: 'ALL',
	SELECTED: 'SELECTED',
};

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: 200 },
	{ title: 'Status', dataIndex: 'status', key: 'status' },
];

export const CreateReturnItemSlip = () => {
	// STATES
	const [searchedKeyword, setSeachedKeyword] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [activeTab, setActiveTab] = useState(tabs.ALL);
	const [count, setCount] = useState(0);
	const [isSubmitting, setSubmitting] = useState(false);

	// REFS
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
		createReturnItemSlip,
		status: returnItemSlipsStatus,
		errors: returnItemSlipsErrors,
	} = useReturnItemSlips();

	// VARIABLES
	const branchId = user?.branch?.id;

	// METHODS
	useEffect(() => {
		getBranchProducts({ branchId, page: 1 });
	}, []);

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
									unit_of_measurement:
										branchProduct.product.unit_of_measurement,
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
									unit_of_measurement: product.unitOfMeasurement,
								};
						  }),
			},
			Schema: Yup.object().shape({
				branchProducts: Yup.array().of(
					Yup.object().shape({
						selected: Yup.boolean(),
						quantity: Yup.number()
							.moreThan(0)
							.when('selected', {
								is: true,
								then: Yup.number()
									.required()
									.test(
										'is-whole-number',
										'Non-weighing items or weighing bulk items require whole number quantity.',
										function test(value) {
											// NOTE: We need to use a no-named function so
											// we can use 'this' and access the other form field value.

											// Condition:
											// 			PIECE   BULK
											// WE  	D(3)   	WHOLE
											// NW  	WHOLE	  WHOLE

											const unitOfMeasurement = this.parent.unit_of_measurement;
											const quantityType = this.parent.quantity_type;

											const isWeighingPiece =
												unitOfMeasurement === unitOfMeasurementTypes.WEIGHING &&
												quantityType === quantityTypes.PIECE;

											if (!isWeighingPiece) {
												return isInteger(Number(value));
											}

											return true;
										},
									),
								otherwise: Yup.number().notRequired(),
							})
							.label('Qty'),
					}),
				),
			}),
		}),
		[branchProducts, activeTab],
	);

	const renderQuantity = (fieldKey, product) => {
		const {
			selected = null,
			product_id: productId = null,
			quantity_type,
			unit_of_measurement,
		} = product;

		return (
			<>
				<div className="QuantityContainer">
					<FormInput
						disabled={!selected}
						id={`${fieldKey}.quantity`}
						isWholeNumber={
							!(
								quantity_type === quantityTypes.PIECE &&
								unit_of_measurement === unitOfMeasurementTypes.WEIGHING
							)
						}
						type="number"
						onChange={(value) => {
							handleChangeQuantity(productId, value);
						}}
					/>
					<FormSelect
						disabled={!selected}
						id={`${fieldKey}.quantity_type`}
						options={quantityTypeOptions}
						onChange={(value) => {
							handleChangeQuantityType(productId, value);
						}}
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
	const handleChangeCheckbox = (productId, value, data = {}) => {
		if (value) {
			productsRef.current[productId] = data;
		} else {
			delete productsRef.current[productId];
		}

		setCount(Object.keys(productsRef.current).length);
	};

	const handleChangeQuantity = (productId, value) => {
		if (productId in productsRef.current) {
			productsRef.current[productId].quantity = value;
		}
	};

	const handleChangeQuantityType = (productId, value) => {
		if (productId in productsRef.current) {
			productsRef.current[productId].quantityType = value;
		}
	};

	// METHODS: Filters
	const handlePageChange = (page, newPageSize) => {
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

	const handleSearch = (keyword) => {
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

	const handleCreate = () => {
		const productIds = Object.keys(productsRef.current);

		if (productIds.length > 0) {
			const products = productIds.map((id) => {
				const { piecesInBulk, quantityType, quantity } =
					productsRef.current[id];

				return {
					product_id: id,
					quantity_returned:
						quantityType === quantityTypes.PIECE
							? quantity
							: convertToPieces(quantity, piecesInBulk),
				};
			});

			createReturnItemSlip({ senderId: user?.id, products }, ({ status }) => {
				if (status === request.SUCCESS) {
					history.push('/branch-manager/return-item-slips');
				}
			});
		}
	};

	const loading = [returnItemSlipsStatus, branchProductsStatus].includes(
		request.REQUESTING,
	);

	return (
		<Content className="CreateReturnItemSlip" title="Return Item Slip">
			<Box>
				<TableHeader
					searchDisabled={activeTab === tabs.SELECTED}
					statusDisabled={activeTab === tabs.SELECTED}
					statuses={branchProductStatusOptionsWithAll}
					title="Create Return Item Slip"
					onSearch={handleSearch}
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
				/>

				<RequestErrors
					className="px-6"
					errors={[
						...convertIntoArray(branchProductsErrors, 'Branch Products'),
						...convertIntoArray(returnItemSlipsErrors, 'Return Item Slip'),
					]}
					withSpaceBottom
				/>

				<Formik
					initialValues={getFormDetails().DefaultValues}
					validationSchema={getFormDetails().Schema}
					enableReinitialize
					onSubmit={async () => {
						setSubmitting(true);
						await sleep(500);
						setSubmitting(false);

						handleCreate();
					}}
				>
					{({ values, setFieldValue }) => (
						<Form>
							<div className="px-6">
								<Tabs
									activeKey={activeTab}
									type="card"
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
										onChangeCheckbox: handleChangeCheckbox,
									}}
									loading={loading || isSubmitting}
									paginationProps={{
										currentPage,
										pageCount,
										pageSize,
										onPageChange: handlePageChange,
									}}
								/>
							</div>

							<Divider dashed />

							<div className="CreateReturnItemSlip_createContainer">
								<Button
									classNames="CreateReturnItemSlip_btnCreate"
									disabled={
										loading || isSubmitting || isEmpty(productsRef.current)
									}
									text="Create"
									type="submit"
									variant="primary"
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
									unitOfMeasurement: product.unit_of_measurement,
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
				loading={loading}
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
			/>
		</>
	);
};
