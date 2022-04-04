import { Divider, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	Content,
	CreateStockOutModal,
	RequestErrors,
	TableHeader,
} from 'components';
import {
	Box,
	Button,
	FieldError,
	FormCheckbox,
	FormInput,
	FormSelect,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import {
	backOrderTypes,
	pageSizeOptions,
	quantityTypeOptions,
	quantityTypes,
	request,
	unitOfMeasurementTypes,
	vatTypes,
} from 'global';
import { useBackOrderCreate } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { useBranchProducts } from 'hooks/useBranchProducts';
import { isEmpty, isInteger } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { convertIntoArray, convertToPieces } from 'utils/function';
import * as Yup from 'yup';

const tabs = {
	ALL: 'ALL',
	SELECTED: 'SELECTED',
};

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type', width: 50, align: 'center' },
	{ title: 'Quantity', dataIndex: 'quantity', width: 200 },
	{ title: 'Remarks', dataIndex: 'remarks', width: 200 },
];

export const CreateStockOut = () => {
	// STATES
	const [searchedKeyword, setSeachedKeyword] = useState('');
	const [activeTab, setActiveTab] = useState(tabs.ALL);
	const [count, setCount] = useState(0);
	const [createStockOutModalVisible, setCreateStockOutModalVisible] =
		useState(false);

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
		mutateAsync: createBackOrder,
		isLoading: isCreateBackOrderLoading,
		error: createBackOrderError,
	} = useBackOrderCreate();

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
									isVatExempted: branchProduct.product.is_vat_exempted,
									remarks: product?.remarks || '',
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
									unit_of_measurement: product.unitOfMeasurement,
									isVatExempted: product.isVatExempted,
									remarks: product.remarks || '',
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
						remarks: Yup.string()
							.when('selected', {
								is: true,
								then: Yup.string().required(),
								otherwise: Yup.string().notRequired(),
							})
							.label('Remarks'),
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
						type="number"
						id={`${fieldKey}.quantity`}
						onChange={(value) => {
							onChangeQuantity(productId, value);
						}}
						isWholeNumber={
							!(
								quantity_type === quantityTypes.PIECE &&
								unit_of_measurement === unitOfMeasurementTypes.WEIGHING
							)
						}
						disabled={!selected}
					/>
					<FormSelect
						id={`${fieldKey}.quantity_type`}
						options={quantityTypeOptions}
						onChange={(value) => {
							onChangeQuantityType(productId, value);
						}}
						disabled
					/>
				</div>
				<ErrorMessage
					name={`${fieldKey}.quantity`}
					render={(error) => <FieldError error={error} />}
				/>
			</>
		);
	};

	const renderRemarks = (fieldKey, product) => {
		const { selected = null, product_id: productId = null } = product;

		return (
			<>
				<FormInput
					id={`${fieldKey}.remarks`}
					onChange={(value) => {
						onChangeRemarks(productId, value);
					}}
					disabled={!selected}
				/>
				<ErrorMessage
					name={`${fieldKey}.remarks`}
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

	const onChangeRemarks = (productId, value) => {
		if (productId in productsRef.current) {
			productsRef.current[productId].remarks = value;
		}
	};

	// METHODS: Filters
	const onPageChange = (page, newPageSize) => {
		getBranchProducts(
			{
				branchId,
				search: searchedKeyword,
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
				isSoldInBranch: true,
				page: 1,
			},
			true,
		);

		setSeachedKeyword(lowerCaseKeyword);
	};

	const onCreate = async (formData) => {
		const productIds = Object.keys(productsRef.current);

		if (productIds.length > 0) {
			const products = productIds.map((id) => {
				const { piecesInBulk, quantityType, quantity, remarks } =
					productsRef.current[id];

				return {
					product_id: id,
					quantity_returned:
						quantityType === quantityTypes.PIECE
							? quantity
							: convertToPieces(quantity, piecesInBulk),
					remarks,
				};
			});

			await createBackOrder({
				senderId: user?.id,
				products,
				type: backOrderTypes.FOR_RETURN,
				overallRemarks: formData.overallRemarks,
				supplierName: formData.supplierName,
				supplierAddress: formData.supplierAddress,
				supplierTin: formData.supplierTin,
				encodedById: formData.encodedById,
			});

			history.push('/branch-manager/stocks?tab=Stock Out');
		}
	};

	const loading =
		branchProductsStatus === request.REQUESTING || isCreateBackOrderLoading;

	return (
		<Content className="CreateBackOrder" title="Stocks">
			<Box>
				<TableHeader
					title="Create Stock Out"
					onSearch={onSearch}
					searchDisabled={activeTab === tabs.SELECTED}
				/>

				<RequestErrors
					className="PaddingHorizontal"
					errors={[
						...convertIntoArray(branchProductsErrors, 'Branch Products'),
						...convertIntoArray(createBackOrderError?.errors, 'Back Orders'),
					]}
					withSpaceBottom
				/>

				<Formik
					innerRef={formRef}
					initialValues={getFormDetails().DefaultValues}
					validationSchema={getFormDetails().Schema}
					onSubmit={() => {
						setCreateStockOutModalVisible(true);
					}}
					enableReinitialize
				>
					{({ values, setFieldValue }) => (
						<Form>
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
										renderRemarks,
										onChangeCheckbox,
									}}
									paginationProps={{
										currentPage,
										pageCount,
										pageSize,
										onPageChange,
									}}
									loading={loading}
								/>
							</div>

							<Divider dashed />

							<div className="CreateBackOrder_createContainer">
								<Button
									classNames="CreateBackOrder_btnCreate"
									type="submit"
									text="Create"
									variant="primary"
									disabled={loading || isEmpty(productsRef.current)}
								/>
							</div>
						</Form>
					)}
				</Formik>

				{createStockOutModalVisible && (
					<CreateStockOutModal
						onSubmit={(formData) => {
							onCreate(formData);
							setCreateStockOutModalVisible(false);
						}}
						onClose={() => {
							setCreateStockOutModalVisible(false);
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
	loading,
}: any) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// VARIABLES
	const {
		values,
		setFieldValue,
		renderQuantity,
		renderRemarks,
		onChangeCheckbox,
	} = formProps;
	const { currentPage, pageCount, pageSize, onPageChange } = paginationProps;

	useEffect(() => {
		setDataSource(
			values.branchProducts.map((product, index) => {
				const fieldKey = `branchProducts.${index}`;
				const isVatExempted = product.isVatExempted;

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
					remarks: renderRemarks(fieldKey, product),
				};
			}),
		);
	}, [values]);

	return (
		<>
			<Table
				columns={columns}
				dataSource={dataSource}
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
				scroll={{ x: 800 }}
				loading={loading}
			/>
		</>
	);
};
