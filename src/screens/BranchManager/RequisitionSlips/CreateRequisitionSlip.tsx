/* eslint-disable react/no-this-in-sfc */
import { Button, Col, Divider, InputNumber, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Content, RequestErrors, TableHeader } from 'components';
import { Box, FieldError, FormCheckbox, Label } from 'components/elements';
import { filterOption } from 'ejjy-global';
import { ErrorMessage, Formik } from 'formik';
import {
	MAX_PAGE_SIZE,
	QUANTITY_NON_WEIGHING_PRECISION,
	QUANTITY_WEIGHING_PRECISION,
	requisitionSlipTypes,
	unitOfMeasurementTypes,
} from 'global';
import { useProductGroups, useRequisitionSlipCreate } from 'hooks';
import { isInteger } from 'lodash';
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { useUserStore } from 'stores';
import { convertIntoArray, getBranchProductStatus } from 'utils';
import * as Yup from 'yup';
import './style.scss';

const FOCUS_TIMEOUT_MS = 500;

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Quantity', dataIndex: 'quantity', width: 125 },
	{ title: 'Status', dataIndex: 'status' },
];

export const CreateRequisitionSlip = () => {
	// STATES
	const [selectedProductGroup, setSelectedProductGroup] = useState(null);

	// CUSTOM HOOKS
	const history = useHistory();
	const user = useUserStore((state) => state.user);

	// const {
	// 	data: { branchProducts, total },
	// 	isFetching: isFetchingBranchProducts,
	// 	error: branchProductsError,
	// } = useProductGroups({
	// 	params: {
	// 		...params,
	// 		branchId: getLocalBranchId(),
	// 		productStatus: params.status === 'all' ? null : params.status,
	// 		isSoldInBranch: true,
	// 		useGoogleApiUrl: true,
	// 	},
	// });
	const {
		mutateAsync: createRequisitionSlip,
		isLoading: isCreatingRequisitionSlip,
		error: createRequisitionSlipError,
	} = useRequisitionSlipCreate();

	// METHODS: Form methods
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchProducts:
					selectedProductGroup?.items?.map(({ product }) => ({
						selected: true,
						key: product.key,
						name: product.name,
						quantity: '',
						status: '',
						unitOfMeasurement: product.unit_of_measurement,
					})) || [],
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
		[selectedProductGroup],
	);

	// METHODS: Filters
	const handleCreate = async (formData) => {
		await createRequisitionSlip({
			requestingUserUsername: user.username,
			type: requisitionSlipTypes.MANUAL,
			products: formData.branchProducts
				.filter((item) => item.selected)
				.map((item) => ({
					key: item.key,
					quantity_piece: item.quantity,
				})),
		});

		history.push('/branch-manager/requisition-slips');
	};

	const isLoading = isCreatingRequisitionSlip;

	return (
		<Content title="Requisition Slips">
			<Box>
				<TableHeader title="Create Requisition Slip" />

				<Filter
					isLoading={isLoading}
					onSelectProductGroup={setSelectedProductGroup}
				/>

				<RequestErrors
					className="px-6"
					errors={convertIntoArray(
						createRequisitionSlipError?.errors,
						'Requisition Slip',
					)}
					withSpaceBottom
				/>

				<Formik
					initialValues={getFormDetails().DefaultValues}
					validationSchema={getFormDetails().Schema}
					enableReinitialize
					onSubmit={handleCreate}
				>
					{({ values, setFieldValue, submitForm }) => (
						<>
							<div className="px-6">
								<ProductsTable
									formProps={{
										values,
										setFieldValue,
									}}
									isLoading={isLoading}
								/>
							</div>

							<Divider dashed />

							<div className="px-6 pb-6 d-flex flex-row-reverse">
								<Button
									disabled={
										isLoading ||
										values.branchProducts.every(
											(branchProduct) => branchProduct.selected === false,
										)
									}
									type="primary"
									onClick={submitForm}
								>
									Submit
								</Button>
							</div>
						</>
					)}
				</Formik>
			</Box>
		</Content>
	);
};

const Filter = ({ isLoading, onSelectProductGroup }) => {
	// CUSTOM HOOKS
	const {
		data: { productGroups },
		isFetching: isFetchingProductGroups,
		error: productGroupsError,
	} = useProductGroups({
		params: { pageSize: MAX_PAGE_SIZE },
		shouldFetchOfflineFirst: true,
	});

	return (
		<>
			<RequestErrors
				className="px-6"
				errors={convertIntoArray(productGroupsError, 'Product Groups')}
				withSpaceBottom
			/>

			<Row className="pa-6 pt-0" gutter={[16, 16]}>
				<Col lg={12} span={24}>
					<Label label="Template" spacing />
					<Select
						className="w-100"
						disabled={isLoading}
						filterOption={filterOption}
						loading={isFetchingProductGroups}
						optionFilterProp="children"
						showSearch
						onChange={(value) => {
							onSelectProductGroup(
								productGroups.find(
									(productGroup) => productGroup.name === value,
								),
							);
						}}
					>
						{productGroups.map(({ name }) => (
							<Select.Option key={name} value={name}>
								{name}
							</Select.Option>
						))}
					</Select>
				</Col>
			</Row>
		</>
	);
};

const ProductsTable = ({ formProps, isLoading }: any) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// REFS
	const inputsRef = useRef([]);

	// VARIABLES
	const { values, setFieldValue } = formProps;

	useEffect(() => {
		const tableData = values.branchProducts.map((branchProduct, index) => {
			const fieldKey = `branchProducts.${index}`;

			return {
				selected: branchProduct.selected,
				key: branchProduct.key,
				name: (
					<FormCheckbox
						id={`${fieldKey}.selected`}
						label={branchProduct.name}
						onChange={(value) => {
							setFieldValue(`${fieldKey}.selected`, value);
						}}
					/>
				),
				quantity: (
					<QuantityInput
						ref={(componentRef) => {
							inputsRef.current[index] = componentRef;
						}}
						fieldKey={fieldKey}
						product={branchProduct}
						onChange={(value) => {
							setFieldValue(`${fieldKey}.quantity`, value);
						}}
					/>
				),
				status: getBranchProductStatus(branchProduct.status),
			};
		});

		setDataSource(tableData);
	}, [values]);

	return (
		<>
			<Table
				className="ProductsTable"
				columns={columns}
				dataSource={dataSource}
				loading={isLoading}
				pagination={false}
				rowClassName={(record: any) => (record.selected ? 'row--selected' : '')}
				bordered
			/>
		</>
	);
};

const QuantityInputComponent = ({ fieldKey, product, onChange }, ref) => {
	const { selected = null, unitOfMeasurement } = product;

	const inputRef = useRef(null);

	useImperativeHandle(
		ref,
		() => ({
			focusInput: () => {
				setTimeout(() => {
					inputRef.current.focus();
				}, FOCUS_TIMEOUT_MS);
			},
		}),
		[inputRef.current],
	);

	return (
		<>
			<InputNumber
				ref={inputRef}
				disabled={!selected}
				precision={
					unitOfMeasurement === unitOfMeasurementTypes.NON_WEIGHING
						? QUANTITY_NON_WEIGHING_PRECISION
						: QUANTITY_WEIGHING_PRECISION
				}
				onChange={onChange}
			/>
			<ErrorMessage
				name={`${fieldKey}.quantity`}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);
};

const QuantityInput = forwardRef(QuantityInputComponent);
