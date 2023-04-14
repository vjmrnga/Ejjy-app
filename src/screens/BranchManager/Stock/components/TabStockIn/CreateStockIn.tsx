/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-mixed-spaces-and-tabs */
import { SearchOutlined } from '@ant-design/icons';
import {
	Button,
	Col,
	Divider,
	Input,
	message,
	Row,
	Select,
	Table,
	Tabs,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	Content,
	CreateStockInModal,
	RequestErrors,
	TableHeader,
} from 'components';
import {
	Box,
	FieldError,
	FormattedInputNumber,
	FormCheckbox,
	FormInput,
	FormSelect,
	Label,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	quantityTypeOptions,
	quantityTypes,
	SEARCH_DEBOUNCE_TIME,
	unitOfMeasurementTypes,
	vatTypes,
} from 'global';
import {
	useBranchProducts,
	useProductCategories,
	useQueryParams,
	useReceivingVoucherCreate,
} from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { stockTabs } from 'screens/BranchManager/Stock/data';
import {
	convertIntoArray,
	convertToPieces,
	filterOption,
	getLocalBranchId,
} from 'utils';
import * as Yup from 'yup';

const tabs = {
	ALL: 'ALL',
	SELECTED: 'SELECTED',
};

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type', width: 50, align: 'center' },
	{ title: 'Quantity', dataIndex: 'quantity', width: 200 },
	{ title: 'Cost Per Piece', dataIndex: 'costPerPiece', width: 200 },
];

export const CreateStockIn = () => {
	// STATES
	const [activeTab, setActiveTab] = useState(tabs.ALL);
	const [count, setCount] = useState(0);
	const [createStockInModalVisible, setCreateStockInModalVisible] =
		useState(false);

	// REFS
	const productsRef = useRef({});

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const history = useHistory();
	const {
		data: { branchProducts, total },
		isFetching: isFetchingBranchProducts,
		error: branchProductsErrors,
	} = useBranchProducts({
		params: {
			...params,
			branchId: getLocalBranchId(),
			isSoldInBranch: true,
		},
	});
	const {
		mutateAsync: createReceivingVoucher,
		isLoading: isCreatingReceivingVoucher,
		error: receivingVoucherError,
	} = useReceivingVoucherCreate();

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
									costPerPiece: product?.costPerPiece || '',
									pieces_in_bulk: branchProduct.product.pieces_in_bulk,
									status: branchProduct.product_status,
									unit_of_measurement:
										branchProduct.product.unit_of_measurement,
									isVatExempted: branchProduct.product.is_vat_exempted,
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
									costPerPiece: product.costPerPiece || '',
									pieces_in_bulk: product.piecesInBulk,
									unit_of_measurement: product.unitOfMeasurement,
									isVatExempted: product.isVatExempted,
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
												return _.isInteger(Number(value));
											}

											return true;
										},
									),
								otherwise: Yup.number().notRequired(),
							})
							.label('Qty'),
						costPerPiece: Yup.number()
							.moreThan(0)
							.when('selected', {
								is: true,
								then: Yup.number().required(),
								otherwise: Yup.number().notRequired(),
							})
							.label('Cost Per Piece'),
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
						id={`${fieldKey}.quantity_type`}
						options={quantityTypeOptions}
						disabled
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

	const renderCostPerPiece = ({ fieldKey, product, setFieldValue }) => {
		const { selected = null, product_id: productId = null } = product;

		return (
			<>
				<FormattedInputNumber
					className="w-100"
					controls={false}
					defaultValue={productsRef?.current?.[productId]?.costPerPiece || ''}
					disabled={!selected}
					onChange={(value) => {
						handleChangeCostPerPiece(productId, value);
						setFieldValue(`${fieldKey}.costPerPiece`, value);
					}}
				/>
				<ErrorMessage
					name={`${fieldKey}.costPerPiece`}
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

	const handleChangeCostPerPiece = (productId, value) => {
		if (productId in productsRef.current) {
			productsRef.current[productId].costPerPiece = value;
		}
	};

	// METHODS: Filters
	const handleCreate = async (formData) => {
		const productIds = Object.keys(productsRef.current);

		if (productIds.length > 0) {
			const products = productIds.map((id) => {
				const { piecesInBulk, quantityType, quantity, costPerPiece } =
					productsRef.current[id];

				return {
					product_id: id,
					quantity:
						quantityType === quantityTypes.PIECE
							? quantity
							: convertToPieces(quantity, piecesInBulk),
					cost_per_piece: costPerPiece,
				};
			});

			await createReceivingVoucher({
				products,
				supplierName: formData.supplierName,
				supplierAddress: formData.supplierAddress,
				supplierTin: formData.supplierTin,
				encodedById: formData.encodedById,
				checkedById: formData.checkedById,
			});

			message.success('Stock in was created successfully');
			history.replace({
				pathname: '/branch-manager/stocks',
				search: `?tab=${stockTabs.STOCK_IN}`,
			});
		}
	};

	const isLoading = isFetchingBranchProducts || isCreatingReceivingVoucher;

	return (
		<Content className="CreateBackOrder" title="Stocks">
			<Box>
				<TableHeader title="Create Stock In" />

				<Filter isLoading={isLoading} />

				<RequestErrors
					className="px-6"
					errors={[
						...convertIntoArray(branchProductsErrors, 'Branch Products'),
						...convertIntoArray(receivingVoucherError?.errors, 'Stock In'),
					]}
					withSpaceBottom
				/>

				<Formik
					initialValues={getFormDetails().DefaultValues}
					validationSchema={getFormDetails().Schema}
					enableReinitialize
					onSubmit={() => {
						setCreateStockInModalVisible(true);
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
										renderCostPerPiece,
										onChangeCheckbox: handleChangeCheckbox,
									}}
									isLoading={isLoading}
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

							<div className="d-flex justify-end px-6 pb-6">
								<Button
									disabled={isLoading || _.isEmpty(productsRef.current)}
									htmlType="submit"
									type="primary"
								>
									Proceed
								</Button>
							</div>
						</Form>
					)}
				</Formik>

				{createStockInModalVisible && (
					<CreateStockInModal
						isLoading={isCreatingReceivingVoucher}
						onClose={() => {
							setCreateStockInModalVisible(false);
						}}
						onSubmit={(formData) => {
							handleCreate(formData);
							setCreateStockInModalVisible(false);
						}}
					/>
				)}
			</Box>
		</Content>
	);
};

const ProductsTable = ({
	activeTab,
	formProps,
	paginationProps,
	isLoading,
}: any) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// VARIABLES
	const {
		values,
		setFieldValue,
		renderQuantity,
		renderCostPerPiece,
		onChangeCheckbox,
	} = formProps;
	const { currentPage, pageCount, pageSize, onPageChange } = paginationProps;

	useEffect(() => {
		setDataSource(
			values.branchProducts.map((product, index) => {
				const fieldKey = `branchProducts.${index}`;
				const { isVatExempted } = product;

				return {
					key: fieldKey,
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
									quantityType: quantityTypes.PIECE,
									piecesInBulk: product.pieces_in_bulk,
									unitOfMeasurement: product.unit_of_measurement,
									isVatExempted: product.isVatExempted,
								});
							}}
						/>
					),
					type: isVatExempted ? vatTypes.VAT_EMPTY : vatTypes.VATABLE,
					quantity: renderQuantity(fieldKey, product),
					costPerPiece: renderCostPerPiece({
						fieldKey,
						product,
						setFieldValue,
					}),
				};
			}),
		);
	}, [values]);

	return (
		<>
			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isLoading}
				pagination={
					activeTab === tabs.ALL
						? {
								current: currentPage,
								total: pageCount,
								pageSize,
								onChange: onPageChange,
								disabled: isLoading,
								position: ['bottomCenter'],
								pageSizeOptions,
						  }
						: false
				}
				scroll={{ x: 800 }}
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
	const {
		data: { productCategories },
		isFetching: isFetchingProductCategories,
	} = useProductCategories({
		params: { pageSize: MAX_PAGE_SIZE },
	});

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
				<Label label="Product Category" spacing />
				<Select
					className="w-100"
					disabled={isLoading}
					filterOption={filterOption}
					loading={isLoading || isFetchingProductCategories}
					optionFilterProp="children"
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams(
							{ productCategory: value },
							{ shouldResetPage: true },
						);
					}}
				>
					{productCategories.map(({ name }) => (
						<Select.Option key={name} value={name}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>
		</Row>
	);
};
