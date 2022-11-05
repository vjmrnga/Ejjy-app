/* eslint-disable react/no-this-in-sfc */
import { Divider, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Content, RequestErrors, TableHeader } from 'components';
import {
	Box,
	Button,
	FieldError,
	FormCheckbox,
	FormInput,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import {
	branchProductStatusOptionsWithAll,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	pageSizeOptions,
	quantityTypes,
	requisitionSlipTypes,
	SEARCH_DEBOUNCE_TIME,
	unitOfMeasurementTypes,
} from 'global';
import {
	useAuth,
	useBranchProducts,
	useQueryParams,
	useRequisitionSlipCreate,
} from 'hooks';
import _, { isEmpty, isInteger } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { convertIntoArray, getBranchProductStatus } from 'utils';
import * as Yup from 'yup';

const tabs = {
	ALL: 'ALL',
	SELECTED: 'SELECTED',
};

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Quantity', dataIndex: 'quantity', width: 200 },
	{ title: 'Status', dataIndex: 'status' },
];

export const CreateRequisitionSlip = () => {
	// STATES
	const [activeTab, setActiveTab] = useState(tabs.ALL);
	const [count, setCount] = useState(0);

	// REFS
	const productsRef = useRef({});

	// CUSTOM HOOKS
	const history = useHistory();
	const { params, setQueryParams } = useQueryParams();
	const { user } = useAuth();
	const {
		data: { branchProducts, total },
		isFetching: isFetchingBranchProducts,
		error: branchProductsError,
	} = useBranchProducts({
		params: {
			...params,
			//! branchId: getBranchId(), Implemeent an online branch id and local branch id
			productStatus: params.status === 'all' ? null : params.status,
			isSoldInBranch: true,
			useGoogleApiUrl: true,
		},
	});
	const {
		mutateAsync: createRequisitionSlip,
		isLoading: isCreating,
		error: createError,
	} = useRequisitionSlipCreate();

	// METHODS: Form methods
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchProducts:
					activeTab === tabs.ALL
						? branchProducts.map((branchProduct) => {
								const { key } = branchProduct.product;
								const quantity = productsRef.current?.[key]?.quantity || '';

								return {
									selected: key in productsRef.current,
									key,
									name: branchProduct.product.name,
									quantity,
									status: branchProduct.product_status,
									unitOfMeasurement: branchProduct.product.unit_of_measurement,
								};
						  })
						: Object.keys(productsRef.current).map((key) => {
								const product = productsRef.current[key];

								return {
									selected: true,
									key,
									name: product.name,
									quantity: product.quantity || '',
									status: product.status,
									unitOfMeasurement: product.unitOfMeasurement,
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

											const isWeighingPiece =
												unitOfMeasurement === unitOfMeasurementTypes.WEIGHING;

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
		const { key, selected = null, unitOfMeasurement } = product;

		return (
			<>
				<div className="QuantityContainer">
					<FormInput
						disabled={!selected}
						id={`${fieldKey}.quantity`}
						isWholeNumber={
							unitOfMeasurement === unitOfMeasurementTypes.NON_WEIGHING
						}
						type="number"
						onChange={(value) => {
							handleChangeQuantity(key, value);
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
	const handleChangeCheckbox = (key, value, data = {}) => {
		if (value) {
			productsRef.current[key] = data;
		} else {
			delete productsRef.current[key];
		}

		setCount(Object.keys(productsRef.current).length);
	};

	const handleChangeQuantity = (key, value) => {
		if (key in productsRef.current) {
			productsRef.current[key].quantity = value;
		}
	};

	// METHODS: Filters
	const onSearchDebounced = useCallback(
		_.debounce((search) => {
			setQueryParams({ search }, { shouldResetPage: true });
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	const handleCreate = async () => {
		const productKeys = Object.keys(productsRef.current);

		if (productKeys.length > 0) {
			const products = productKeys.map((key) => {
				const { quantity } = productsRef.current[key];

				return {
					key,
					quantity_piece: quantity,
				};
			});

			await createRequisitionSlip({
				requestingUserUsername: user.username,
				type: requisitionSlipTypes.MANUAL,
				products,
			});

			history.push('/branch-manager/requisition-slips');
		}
	};

	const loading = isCreating || isFetchingBranchProducts;

	return (
		<Content className="CreateRequisitionSlip" title="Requisition Slips">
			<Box>
				<TableHeader
					searchDisabled={activeTab === tabs.SELECTED}
					statusDisabled={activeTab === tabs.SELECTED}
					statuses={branchProductStatusOptionsWithAll}
					title="Create Requisition Slip"
					onSearch={onSearchDebounced}
					onStatusSelect={(status) => {
						setQueryParams({ status }, { shouldResetPage: true });
					}}
				/>

				<RequestErrors
					className="px-6"
					errors={[
						...convertIntoArray(createError?.errors, 'Requisition Slip'),
						...convertIntoArray(branchProductsError, 'Branch Products'),
					]}
					withSpaceBottom
				/>

				<Formik
					initialValues={getFormDetails().DefaultValues}
					validationSchema={getFormDetails().Schema}
					enableReinitialize
					onSubmit={handleCreate}
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
									loading={loading}
									paginationProps={{
										currentPage: Number(params.page) || DEFAULT_PAGE,
										pageCount: total,
										pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
										onPageChange: (page, newPageSize) => {
											setQueryParams({
												page,
												pageSize: newPageSize,
											});
										},
									}}
								/>
							</div>

							<Divider dashed />

							<div className="px-6 pb-6 d-flex flex-row-reverse">
								<Button
									disabled={loading || isEmpty(productsRef.current)}
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
	const [dataSource, setDataSource] = useState([]);

	// VARIABLES
	const { values, setFieldValue, renderQuantity, onChangeCheckbox } = formProps;
	const { currentPage, pageCount, pageSize, onPageChange } = paginationProps;

	useEffect(() => {
		const tableData = values.branchProducts.map((branchProduct, index) => {
			const fieldKey = `branchProducts.${index}`;

			return {
				key: branchProduct.key,
				name: (
					<FormCheckbox
						id={`${fieldKey}.selected`}
						label={branchProduct.name}
						onChange={(value) => {
							if (!value) {
								if (activeTab === tabs.ALL) {
									setFieldValue(`${fieldKey}.quantity`, '');
									setFieldValue(
										`${fieldKey}.quantity_type`,
										quantityTypes.PIECE,
									);
								}

								if (activeTab === tabs.SELECTED) {
									const newValues = values.branchProducts.filter(
										({ key }) => key !== branchProduct.key,
									);
									setFieldValue('branchProducts', newValues);
								}
							}

							onChangeCheckbox(branchProduct.key, value, {
								name: branchProduct.name,
								status: branchProduct.status,
								unitOfMeasurement: branchProduct.unitOfMeasurement,
							});
						}}
					/>
				),
				quantity: renderQuantity(fieldKey, branchProduct),
				status: getBranchProductStatus(branchProduct.status),
			};
		});

		setDataSource(tableData);
	}, [values]);

	return (
		<>
			<Table
				columns={columns}
				dataSource={dataSource}
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
