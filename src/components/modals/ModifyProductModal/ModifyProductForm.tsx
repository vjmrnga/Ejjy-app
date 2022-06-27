/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-confusing-arrow */
/* eslint-disable newline-per-chained-call */
import { Col, Divider, Input, Row, Select, Typography } from 'antd';
import { ScrollToFieldError } from 'components';
import {
	Button,
	FieldError,
	FieldWarning,
	FormattedInputNumber,
	FormInput,
	FormRadioButton,
	FormSelect,
	Label,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import {
	booleanOptions,
	checkingTypesOptions,
	inputTypes,
	MAX_PAGE_SIZE,
	productCheckingTypes,
	productTypes,
	unitOfMeasurementTypes,
} from 'global';
import { useProductCategories } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { isInteger } from 'lodash';
import React, { useCallback } from 'react';
import { formatQuantity } from 'utils';
import * as Yup from 'yup';

const { Text } = Typography;

const type = [
	{
		id: productTypes.WET,
		label: 'Wet',
		value: productTypes.WET,
	},
	{
		id: productTypes.DRY,
		label: 'Dry',
		value: productTypes.DRY,
	},
];

const unitOfMeasurementOptions = [
	{
		id: unitOfMeasurementTypes.WEIGHING,
		label: 'Weighing',
		value: unitOfMeasurementTypes.WEIGHING,
	},
	{
		id: unitOfMeasurementTypes.NON_WEIGHING,
		label: 'Non-Weighing',
		value: unitOfMeasurementTypes.NON_WEIGHING,
	},
];

const isVatExemptedOptions = [
	{
		id: 'vat',
		label: 'VAT',
		value: 'false',
	},
	{
		id: 'vae',
		label: 'VAT-EXEMPT',
		value: 'true',
	},
];

interface Props {
	branchProduct: any;
	isCurrentBalanceVisible: boolean;
	loading: boolean;
	onClose: any;
	onSubmit: any;
	pointSystemTags: any;
	product: any;
}

export const ModifyProductForm = ({
	branchProduct,
	isCurrentBalanceVisible,
	loading,
	onClose,
	onSubmit,
	pointSystemTags,
	product,
}: Props) => {
	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		data: { productCategories },
	} = useProductCategories({
		params: {
			pageSize: MAX_PAGE_SIZE,
		},
	});

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				actingUserId: user.id,
				allowableSpoilage: product?.allowable_spoilage * 100 || '',
				barcode: product?.barcode || '',
				sellingBarcode: product?.selling_barcode || '',
				packingBarcode: product?.packing_barcode || '',
				costPerBulk: product?.cost_per_bulk || '',
				costPerPiece: product?.cost_per_piece || '',
				description: product?.description || '',
				hasQuantityAllowance: product?.has_quantity_allowance || false,
				isShownInScaleList: product?.is_shown_in_scale_list || false,
				isVatExempted: product?.is_vat_exempted?.toString() || 'false',
				maxBalance: product?.max_balance
					? formatQuantity({
							unitOfMeasurement: product?.unit_of_measurement,
							quantity: product.max_balance,
					  })
					: '',
				name: product?.name || '',
				piecesInBulk: product?.pieces_in_bulk,
				conversionAmount: product?.conversion_amount || '',
				pointSystemTagId: product?.point_system_tag?.id || '',
				pricePerBulk: product?.price_per_bulk || '',
				pricePerPiece: product?.price_per_piece || '',
				printDetails: product?.print_details || '',
				productCategory: product?.product_category,
				reorderPoint: product?.reorder_point
					? formatQuantity({
							unitOfMeasurement: product?.unit_of_measurement,
							quantity: product.reorder_point,
					  })
					: '',
				textcode: product?.textcode || '',
				type: product?.type || productTypes.WET,
				unitOfMeasurement:
					product?.unit_of_measurement || unitOfMeasurementTypes.NON_WEIGHING,
				sellingBarcodeUnitOfMeasurement:
					product?.selling_barcode_unit_of_measurement ||
					unitOfMeasurementTypes.WEIGHING,
				packingBarcodeUnitOfMeasurement:
					product?.packing_barcode_unit_of_measurement ||
					unitOfMeasurementTypes.NON_WEIGHING,

				// NOTE: Branch product settings
				creditPricePerPiece: branchProduct?.credit_price_per_piece || '',
				creditPricePerBulk: branchProduct?.credit_price_per_bulk || '',
				checking: branchProduct?.is_daily_checked
					? productCheckingTypes.DAILY
					: productCheckingTypes.RANDOM,
				currentBalance: branchProduct?.current_balance,
				isDailyChecked: branchProduct?.is_daily_checked,
				isRandomlyChecked: branchProduct?.is_randomly_checked,
				isSoldInBranch: branchProduct?.is_sold_in_branch,
				markdownPricePerPiece1: branchProduct?.markdown_price_per_piece1 || '',
				markdownPricePerPiece2: branchProduct?.markdown_price_per_piece2 || '',
				markdownPricePerBulk1: branchProduct?.markdown_price_per_bulk1 || '',
				markdownPricePerBulk2: branchProduct?.markdown_price_per_bulk2 || '',
			},
			Schema: Yup.object().shape(
				{
					barcode: Yup.string()
						.max(50)
						.test(
							'barcode-selling-required-1',
							'Input either a Product Barcode or Scale Barcode',
							function test(value) {
								// NOTE: We need to use a no-named function so
								// we can use 'this' and access the other form field value.
								return value || this.parent.sellingBarcode;
							},
						),
					textcode: Yup.string().max(50),
					sellingBarcode: Yup.string()
						.max(50)
						.test(
							'barcode-selling-required-2',
							'Input either a Product Barcode or Scale Barcode',
							function test(value) {
								// NOTE: We need to use a no-named function so
								// we can use 'this' and access the other form field value.
								return value || this.parent.barcode;
							},
						)
						.label('Scale Barcode'),
					packingBarcode: Yup.string().max(50).label('Packing Barcode'),

					name: Yup.string().required().max(70).label('Name'),
					type: Yup.string().label('TT-001'),
					unitOfMeasurement: Yup.string().label('TT-002'),
					productCategory: Yup.string().label('Product Category'),
					printDetails: Yup.string().required().label('Print Details'),
					description: Yup.string().required().label('Description'),
					piecesInBulk: Yup.number()
						.required()
						.moreThan(0)
						.nullable()
						.label('Pieces in Bulk'),
					conversionAmount: Yup.number()
						.when(['barcode', 'sellingBarcode'], {
							is: (barcode, sellingBarcode) => barcode || sellingBarcode,
							then: Yup.number().required().moreThan(0),
							otherwise: Yup.number().notRequired().nullable(),
						})
						.label('Conversion Amount'),
					allowableSpoilage: Yup.number()
						.when(['unitOfMeasurement'], {
							is: (unitOfMeasurementValue) =>
								unitOfMeasurementValue === unitOfMeasurementTypes.WEIGHING,
							then: Yup.number().integer().min(0).max(100).required(),
							otherwise: Yup.number().notRequired().nullable(),
						})
						.label('Allowable Spoilage'),
					hasQuantityAllowance: Yup.boolean()
						.when(['unitOfMeasurement'], {
							is: (unitOfMeasurementValue) =>
								unitOfMeasurementValue === unitOfMeasurementTypes.WEIGHING,
							then: Yup.boolean().required(),
							otherwise: Yup.boolean().notRequired().nullable(),
						})
						.label('Qty Allowance'),
					reorderPoint: Yup.number()
						.required()
						.moreThan(0)
						.nullable()
						.test(
							'is-whole-number',
							'Non-weighing items require whole number quantity.',
							function test(value) {
								// NOTE: We need to use a no-named function so
								// we can use 'this' and access the other form field value.
								const unitOfMeasurement = this.parent.unitOfMeasurement;
								return unitOfMeasurement === unitOfMeasurementTypes.NON_WEIGHING
									? isInteger(Number(value))
									: true;
							},
						)
						.label('Reorder Point'),
					maxBalance: Yup.number()
						.required()
						.moreThan(0)
						.nullable()
						.test(
							'is-whole-number',
							'Non-weighing items require whole number quantity.',
							function test(value) {
								// NOTE: We need to use a no-named function so
								// we can use 'this' and access the other form field value.
								const unitOfMeasurement = this.parent.unitOfMeasurement;
								return unitOfMeasurement === unitOfMeasurementTypes.NON_WEIGHING
									? isInteger(Number(value))
									: true;
							},
						)
						.label('Max Balance'),
					costPerPiece: Yup.number()
						.required()
						.moreThan(0)
						.nullable()
						.label('Cost per Piece'),
					costPerBulk: Yup.number()
						.required()
						.moreThan(0)
						.nullable()
						.label('Cost Per Bulk'),
					pricePerPiece: Yup.number()
						.required()
						.moreThan(0)
						.nullable()
						.label('Regular Price (Piece)'),
					pricePerBulk: Yup.number()
						.required()
						.moreThan(0)
						.nullable()
						.label('Regular Price (Bulk)'),
					pointSystemTagId: Yup.string().nullable().label('Point System Tag'),

					checking: Yup.string().label('Checking'),
					currentBalance: isCurrentBalanceVisible
						? Yup.number()
								.required()
								.min(0)
								.test(
									'is-whole-number',
									'Non-weighing items require whole number quantity.',
									function test(value) {
										// NOTE: We need to use a no-named function so
										// we can use 'this' and access the other form field value.
										const unitOfMeasurement = this.parent.unitOfMeasurement;
										return unitOfMeasurement ===
											unitOfMeasurementTypes.NON_WEIGHING
											? isInteger(Number(value))
											: true;
									},
								)
								.label('Current Balance')
						: undefined,
					isDailyChecked: Yup.boolean(),
					isRandomlyChecked: Yup.boolean(),
					markdownPricePerPiece1: Yup.number()
						.nullable()
						.label('Wholesale Price (Piece)'),
					markdownPricePerPiece2: Yup.number()
						.nullable()
						.label('Special Price (Piece)'),
					markdownPricePerBulk1: Yup.number()
						.nullable()
						.label('Wholesale Price (Bulk)'),
					markdownPricePerBulk2: Yup.number()
						.nullable()
						.label('Special Price (Bulk)'),
					creditPricePerPiece: Yup.number()
						.nullable()
						.test(
							'greater-than-regular-price',
							'Credit price must not be less than to the regular price (piece).',
							function test(value) {
								// NOTE: We need to use a no-named function so
								// we can use 'this' and access the other form field value.
								if (product) {
									const regularPrice = Number(this.parent.pricePerPiece);
									const creditPrice = value ? Number(value) : 0;

									return creditPrice >= regularPrice;
								}

								return true;
							},
						)
						.label('Credit Price per Piece'),
					creditPricePerBulk: Yup.number()
						.nullable()
						.test(
							'greater-than-regular-price',
							'Credit price must not be less than to the regular price (bulk).',
							function test(value) {
								// NOTE: We need to use a no-named function so
								// we can use 'this' and access the other form field value.
								if (product) {
									const regularPrice = Number(this.parent.pricePerBulk);
									const creditPrice = value ? Number(value) : 0;

									return creditPrice >= regularPrice;
								}

								return true;
							},
						)
						.label('Credit Price Per Bulk'),
				},
				[['barcode', 'textcode']],
			),
		}),
		[isCurrentBalanceVisible, branchProduct, product, user],
	);

	const getProductCategoriesOptions = useCallback(
		() =>
			productCategories.map(({ name }) => ({
				name,
				value: name,
			})),
		[productCategories],
	);

	const renderInputField = ({
		name,
		label,
		type = inputTypes.TEXT,
		values,
		setFieldValue,
		options = {},
	}) => (
		<>
			<Label id={name} label={label} spacing />
			{[inputTypes.TEXT, inputTypes.NUMBER].includes(type) && (
				<Input
					name={name}
					value={values[name]}
					type={type}
					onChange={(e) => {
						setFieldValue(name, e.target.value);
					}}
					size="large"
					{...options}
				/>
			)}
			{type === inputTypes.MONEY && (
				<FormattedInputNumber
					size="large"
					value={values[name]}
					controls={false}
					style={{ width: '100%' }}
					onChange={(value) => {
						setFieldValue(name, value);
					}}
					{...options}
				/>
			)}
			<ErrorMessage
				name={name}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData) => {
				const isWeighing =
					formData.unitOfMeasurement === unitOfMeasurementTypes.WEIGHING;

				let data = {
					...formData,
					hasQuantityAllowance: isWeighing
						? formData.hasQuantityAllowance
						: product?.has_quantity_allowance,
					allowableSpoilage: isWeighing
						? Number(formData.allowableSpoilage) / 100
						: undefined,
					isDailyChecked: formData.checking === productCheckingTypes.DAILY,
					isRandomlyChecked: formData.checking === productCheckingTypes.RANDOM,
				};

				onSubmit(data);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<ScrollToFieldError />

					<Row gutter={[16, 16]}>
						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'barcode',
								label: 'Barcode',
								setFieldValue,
								values,
							})}
						</Col>

						<Col sm={12} xs={24}>
							<Label label="TT-002" spacing />
							<FormRadioButton
								id="unitOfMeasurement"
								items={unitOfMeasurementOptions}
							/>
							<ErrorMessage
								name="unitOfMeasurement"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'sellingBarcode',
								label: 'Scale Barcode',
								setFieldValue,
								values,
							})}
						</Col>

						<Col sm={12} xs={24}>
							<Label label="TT-002" spacing />
							<FormRadioButton
								id="sellingBarcodeUnitOfMeasurement"
								items={unitOfMeasurementOptions}
								disabled={!values.sellingBarcode}
							/>
							<ErrorMessage
								name="sellingBarcodeUnitOfMeasurement"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'packingBarcode',
								label: 'Packing Barcode',
								setFieldValue,
								values,
							})}
						</Col>

						<Col sm={12} xs={24}>
							<Label label="TT-002" spacing />
							<FormRadioButton
								id="packingBarcodeUnitOfMeasurement"
								items={unitOfMeasurementOptions}
								disabled={!values.packingBarcode}
							/>
							<ErrorMessage
								name="packingBarcodeUnitOfMeasurement"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'textcode',
								label: 'Textcode',
								setFieldValue,
								values,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'name',
								label: 'Name',
								setFieldValue,
								values,
							})}
						</Col>

						<Col span={24}>
							{renderInputField({
								name: 'printDetails',
								label: 'Print Details',
								setFieldValue,
								values,
							})}
						</Col>

						<Col span={24}>
							{renderInputField({
								name: 'description',
								label: 'Description',
								setFieldValue,
								values,
							})}
						</Col>

						<Col sm={12} xs={24}>
							<Label label="Product Category" spacing />
							<FormSelect
								id="productCategory"
								options={getProductCategoriesOptions()}
							/>
							<ErrorMessage
								name="productCategory"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label label="Include In Scale" spacing />
							<FormRadioButton id="isShownInScaleList" items={booleanOptions} />
							<ErrorMessage
								name="isShownInScaleList"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Divider dashed>TAGS</Divider>

						<Col sm={12} xs={24}>
							<Label label="TT-001" spacing />
							<FormRadioButton id="type" items={type} />
							<ErrorMessage
								name="type"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label label="TT-003" spacing />
							<FormRadioButton
								id="isVatExempted"
								items={isVatExemptedOptions}
							/>
							<ErrorMessage
								name="isVatExempted"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label label="Qty Allowance" spacing />
							<FormRadioButton
								id="hasQuantityAllowance"
								items={booleanOptions}
								disabled={
									values?.unitOfMeasurement !== unitOfMeasurementTypes.WEIGHING
								}
							/>
							<ErrorMessage
								name="hasQuantityAllowance"
								render={(error) => <FieldError error={error} />}
							/>
							{values?.unitOfMeasurement !==
								unitOfMeasurementTypes.WEIGHING && (
								<FieldWarning message="Qty Allowance won't be included when submited" />
							)}
						</Col>

						<Col sm={12} xs={24}>
							<Label id="pointSystemTagId" label="Point System Tag" spacing />
							<Select
								size="large"
								className="w-100"
								value={values.pointSystemTagId}
								onChange={(value) => {
									setFieldValue('pointSystemTagId', value);
								}}
								optionFilterProp="children"
								filterOption={(input, option) =>
									option.children
										.toString()
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								showSearch
								allowClear
							>
								{pointSystemTags.map((pointSystemTags) => (
									<Select.Option
										key={pointSystemTags.id}
										value={pointSystemTags.id}
									>
										{pointSystemTags.name}
									</Select.Option>
								))}
							</Select>
							<ErrorMessage
								name="pointSystemTagId"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Divider dashed>QUANTITY</Divider>

						<Col sm={12} xs={24}>
							<Label label="Reorder Point" spacing />
							<FormInput
								type="number"
								id="reorderPoint"
								isWholeNumber={
									values.unitOfMeasurement ===
									unitOfMeasurementTypes.NON_WEIGHING
								}
							/>
							<ErrorMessage
								name="reorderPoint"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label label="Max Balance" spacing />
							<FormInput
								type="number"
								id="maxBalance"
								isWholeNumber={
									values.unitOfMeasurement ===
									unitOfMeasurementTypes.NON_WEIGHING
								}
							/>
							<ErrorMessage
								name="maxBalance"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'piecesInBulk',
								label: 'Pieces in Bulk',
								setFieldValue,
								values,
								type: inputTypes.NUMBER,
							})}
						</Col>

						{(values.barcode || values.sellingBarcode) && (
							<Col sm={12} xs={24}>
								{renderInputField({
									name: 'conversionAmount',
									label: 'Conversion Amount',
									setFieldValue,
									values,
									type: inputTypes.NUMBER,
								})}
							</Col>
						)}

						<Col sm={12} xs={24}>
							<Label label="" spacing />
							{renderInputField({
								name: 'allowableSpoilage',
								label: 'Allowable Spoilage (%)',
								setFieldValue,
								values,
								type: inputTypes.NUMBER,
								options: {
									disabled:
										values?.unitOfMeasurement !==
										unitOfMeasurementTypes.WEIGHING,
								},
							})}

							{values?.unitOfMeasurement !==
								unitOfMeasurementTypes.WEIGHING && (
								<FieldWarning message="Allowable Spoilage won't be included when submited." />
							)}
						</Col>

						<Divider dashed>
							PRICES
							<br />
							<Text mark>(must be in 2 decimal places)</Text>
						</Divider>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'costPerPiece',
								label: 'Cost (Piece)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'costPerBulk',
								label: 'Cost (Bulk)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'pricePerPiece',
								label: 'Regular Price (Piece)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'pricePerBulk',
								label: 'Regular Price (Bulk)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>

						{product && (
							<>
								<Col sm={12} xs={24}>
									{renderInputField({
										name: 'creditPricePerPiece',
										label: 'Credit Price (Piece)',
										setFieldValue,
										values,
										type: inputTypes.MONEY,
									})}
								</Col>

								<Col sm={12} xs={24}>
									{renderInputField({
										name: 'creditPricePerBulk',
										label: 'Credit Price (Bulk)',
										setFieldValue,
										values,
										type: inputTypes.MONEY,
									})}
								</Col>

								<Col sm={12} xs={24}>
									{renderInputField({
										name: 'markdownPricePerPiece1',
										label: 'Wholesale Price (Piece)',
										setFieldValue,
										values,
										type: inputTypes.MONEY,
									})}
								</Col>

								<Col sm={12} xs={24}>
									{renderInputField({
										name: 'markdownPricePerBulk1',
										label: 'Wholesale Price (Bulk)',
										setFieldValue,
										values,
										type: inputTypes.MONEY,
									})}
								</Col>

								<Col sm={12} xs={24}>
									{renderInputField({
										name: 'markdownPricePerPiece2',
										label: 'Special Price (Piece)',
										setFieldValue,
										values,
										type: inputTypes.MONEY,
									})}
								</Col>

								<Col sm={12} xs={24}>
									{renderInputField({
										name: 'markdownPricePerBulk2',
										label: 'Special Price (Bulk)',
										setFieldValue,
										values,
										type: inputTypes.MONEY,
									})}
								</Col>
							</>
						)}

						{product && (
							<>
								<Divider dashed>BRANCH PRODUCT SETTINGS</Divider>

								<Col sm={12} xs={24}>
									<Label label="In Stock" spacing />
									<FormRadioButton id="isSoldInBranch" items={booleanOptions} />
									<ErrorMessage
										name="isSoldInBranch"
										render={(error) => <FieldError error={error} />}
									/>
								</Col>

								<Col sm={12} xs={24}>
									<Label label="Checking" spacing />
									<FormRadioButton id="checking" items={checkingTypesOptions} />
									<ErrorMessage
										name="checking"
										render={(error) => <FieldError error={error} />}
									/>
								</Col>
							</>
						)}
					</Row>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={loading}
						/>
						<Button
							type="submit"
							text={product ? 'Edit' : 'Create'}
							variant="primary"
							loading={loading}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
