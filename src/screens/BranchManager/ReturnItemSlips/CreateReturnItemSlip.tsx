/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-mixed-spaces-and-tabs */
import { SearchOutlined } from '@ant-design/icons';
import { Col, Divider, Input, Row, Select, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Content, RequestErrors, TableHeader } from 'components';
import {
	Box,
	Button,
	FieldError,
	FormCheckbox,
	FormInput,
	FormSelect,
	Label,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import {
	branchProductStatusOptionsWithAll,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	pageSizeOptions,
	quantityTypeOptions,
	quantityTypes,
	SEARCH_DEBOUNCE_TIME,
	unitOfMeasurementTypes,
} from 'global';
import {
	useBranchProducts,
	useQueryParams,
	useReturnItemSlipCreate,
} from 'hooks';
import _, { isEmpty, isInteger } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserStore } from 'stores';
import {
	convertIntoArray,
	convertToPieces,
	filterOption,
	getBranchProductStatus,
	getLocalBranchId,
	sleep,
} from 'utils';
import * as Yup from 'yup';

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
	const [activeTab, setActiveTab] = useState(tabs.ALL);
	const [count, setCount] = useState(0);
	const [isSubmitting, setSubmitting] = useState(false);

	// REFS
	const productsRef = useRef({});

	// CUSTOM HOOKS
	const history = useHistory();
	const user = useUserStore((state) => state.user);
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branchProducts, total },
		isFetching: isFetchingBranchProducts,
		error: branchProductsErrors,
	} = useBranchProducts({
		params: {
			...params,
			productStatus: params?.status === 'all' ? null : params?.status,
			branchId: getLocalBranchId(),
			isSoldInBranch: true,
		},
	});
	const {
		mutateAsync: createReturnItemSlip,
		isLoading: isCreatingReturnItemSlip,
		error: createReturnItemSlipError,
	} = useReturnItemSlipCreate();

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
	const handleCreate = async () => {
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

			await createReturnItemSlip({
				senderId: user?.id,
				products,
			});
			history.push('/branch-manager/return-item-slips');
		}
	};

	const isLoading = isCreatingReturnItemSlip || isFetchingBranchProducts;

	return (
		<Content className="CreateReturnItemSlip" title="Return Item Slip">
			<Box>
				<TableHeader title="Create Return Item Slip" />

				<Filter isLoading={isLoading} />

				<RequestErrors
					className="px-6"
					errors={[
						...convertIntoArray(branchProductsErrors, 'Branch Products'),
						...convertIntoArray(
							createReturnItemSlipError?.errors,
							'Return Item Slip',
						),
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
									loading={isLoading || isSubmitting}
									paginationProps={{
										current: Number(params.page) || DEFAULT_PAGE,
										total,
										pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
										onChange: (page, newPageSize) => {
											setQueryParams({
												page,
												pageSize: newPageSize,
											});
										},
										disabled: !isLoading,
										position: ['bottomCenter'],
										pageSizeOptions,
									}}
								/>
							</div>

							<Divider dashed />

							<div className="CreateReturnItemSlip_createContainer">
								<Button
									classNames="CreateReturnItemSlip_btnCreate"
									disabled={
										isLoading || isSubmitting || isEmpty(productsRef.current)
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
				bordered
			/>
		</>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();

	// METHODS
	const handleSearchDebounced = useCallback(
		_.debounce((keyword) => {
			setQueryParams(
				{ search: keyword?.toLowerCase() },
				{ shouldResetPage: true },
			);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Row className="pa-6 pt-0" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					defaultValue={params.search}
					disabled={isLoading}
					prefix={<SearchOutlined />}
					allowClear
					onChange={(event) => handleSearchDebounced(event.target.value.trim())}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Status" spacing />
				<Select
					className="w-100"
					disabled={isLoading}
					filterOption={filterOption}
					optionFilterProp="children"
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ status: value }, { shouldResetPage: true });
					}}
				>
					{branchProductStatusOptionsWithAll.map(({ name, value }) => (
						<Select.Option key={value} value={value}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>
		</Row>
	);
};
