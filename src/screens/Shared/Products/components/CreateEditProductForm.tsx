/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-confusing-arrow */
/* eslint-disable newline-per-chained-call */
import { Col, Divider, Input, Row, Typography } from 'antd';
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
	productCheckingTypes,
	productTypes,
	unitOfMeasurementTypes,
} from 'global';
import { useAuth } from 'hooks/useAuth';
import { isInteger } from 'lodash';
import { IProductCategory } from 'models';
import React, { useCallback, useState } from 'react';
import { formatQuantity, formatRemoveCommas, sleep } from 'utils';
import * as Yup from 'yup';
import '../style.scss';

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
	product: any;
	productCategories: IProductCategory[];
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateEditProductForm = ({
	product,
	productCategories,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// CUSTOM HOOKS
	const { user } = useAuth();

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				acting_user_id: user.id,
				barcode: product?.barcode || '',
				textcode: product?.textcode || '',
				name: product?.name || '',
				type: product?.type || productTypes.WET,
				unit_of_measurement:
					product?.unit_of_measurement || unitOfMeasurementTypes.WEIGHING,
				print_details: product?.print_details || '',
				description: product?.description || '',
				allowable_spoilage: product?.allowable_spoilage * 100 || '',
				pieces_in_bulk: product?.pieces_in_bulk,
				cost_per_piece: product?.cost_per_piece || '',
				cost_per_bulk: product?.cost_per_bulk || '',
				reorder_point: product?.reorder_point
					? formatQuantity(product?.unit_of_measurement, product.reorder_point)
					: '',
				max_balance: product?.max_balance
					? formatQuantity(product?.unit_of_measurement, product.max_balance)
					: '',
				price_per_piece: product?.price_per_piece || '',
				price_per_bulk: product?.price_per_bulk || '',
				product_category: product?.product_category,
				is_vat_exempted: product?.is_vat_exempted?.toString() || 'false',
				is_shown_in_scale_list: product?.is_shown_in_scale_list || false,
				has_quantity_allowance: product?.has_quantity_allowance || false,

				will_carry_over_max_balance: product ? false : undefined,
				will_carry_over_reorder_point: product ? false : undefined,
				will_carry_over_price_per_piece: product ? false : undefined,
				will_carry_over_price_per_bulk: product ? false : undefined,
				will_carry_over_cost_per_piece: product ? false : undefined,
				will_carry_over_cost_per_bulk: product ? false : undefined,
				will_carry_over_allowable_spoilage: product ? false : undefined,

				// NOTE: Branch product settings
				checking: undefined,
				is_daily_checked: undefined,
				is_randomly_checked: undefined,
				is_sold_in_branch: undefined,
				markdown_price_per_piece1: undefined,
				markdown_price_per_piece2: undefined,
				markdown_price_per_bulk1: undefined,
				markdown_price_per_bulk2: undefined,

				will_carry_over_checking: product ? false : undefined,
				will_carry_over_is_sold_in_branch: product ? false : undefined,
				will_carry_over_markdown_price_per_piece1: product ? false : undefined,
				will_carry_over_markdown_price_per_bulk1: product ? false : undefined,
				will_carry_over_markdown_price_per_piece2: product ? false : undefined,
				will_carry_over_markdown_price_per_bulk2: product ? false : undefined,
			},
			Schema: Yup.object().shape(
				{
					barcode: Yup.string().max(
						50,
						'Barcode/Textcode must be at most 50 characters',
					),
					textcode: Yup.string().max(
						50,
						'Barcode/Textcode must be at most 50 characters',
					),
					name: Yup.string().required().max(70).label('Name'),
					type: Yup.string().label('TT-001'),
					unit_of_measurement: Yup.string().label('TT-002'),
					product_category: Yup.string().label('Product Category'),
					print_details: Yup.string().required().label('Print Details'),
					description: Yup.string().required().label('Description'),
					pieces_in_bulk: Yup.number()
						.required()
						.min(0)
						.label('Pieces in Bulk'),
					allowable_spoilage: Yup.number()
						.when(['unit_of_measurement'], {
							is: (unitOfMeasurementValue) =>
								unitOfMeasurementValue === unitOfMeasurementTypes.WEIGHING,
							then: Yup.number().integer().min(0).max(100).required(),
							otherwise: Yup.number().notRequired().nullable(),
						})
						.label('Allowable Spoilage'),
					has_quantity_allowance: Yup.boolean()
						.when(['unit_of_measurement'], {
							is: (unitOfMeasurementValue) =>
								unitOfMeasurementValue === unitOfMeasurementTypes.WEIGHING,
							then: Yup.boolean().required(),
							otherwise: Yup.boolean().notRequired().nullable(),
						})
						.label('Qty Allowance'),
					reorder_point: Yup.number()
						.required()
						.moreThan(0)
						.test(
							'is-whole-number',
							'Non-weighing items require whole number quantity.',
							function test(value) {
								// NOTE: We need to use a no-named function so
								// we can use 'this' and access the other form field value.
								const unitOfMeasurement = this.parent.unit_of_measurement;
								return unitOfMeasurement === unitOfMeasurementTypes.NON_WEIGHING
									? isInteger(Number(value))
									: true;
							},
						)
						.label('Reorder Point'),
					max_balance: Yup.number()
						.required()
						.moreThan(0)
						.test(
							'is-whole-number',
							'Non-weighing items require whole number quantity.',
							function test(value) {
								// NOTE: We need to use a no-named function so
								// we can use 'this' and access the other form field value.
								const unitOfMeasurement = this.parent.unit_of_measurement;
								return unitOfMeasurement === unitOfMeasurementTypes.NON_WEIGHING
									? isInteger(Number(value))
									: true;
							},
						)
						.label('Max Balance'),
					cost_per_piece: Yup.string()
						.required()
						.min(0)
						.label('Cost per Piece'),
					cost_per_bulk: Yup.string().required().min(0).label('Cost Per Bulk'),
					price_per_piece: Yup.string()
						.required()
						.min(0)
						.label('Price per Piece'),
					price_per_bulk: Yup.string()
						.required()
						.min(0)
						.label('Price per Bulk'),

					checking: Yup.string().label('Checking'),
					is_daily_checked: Yup.boolean(),
					is_randomly_checked: Yup.boolean(),
					markdown_price_per_piece1: Yup.number()
						.min(0)
						.label('Wholesale Price (piece)'),
					markdown_price_per_piece2: Yup.number()
						.min(0)
						.label('Special Price (piece)'),
					markdown_price_per_bulk1: Yup.number()
						.min(0)
						.label('Wholesale Price (bulk)'),
					markdown_price_per_bulk2: Yup.number()
						.min(0)
						.label('Special Price (bulk)'),
				},
				[['barcode', 'textcode']],
			),
		}),
		[product, user],
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
			onSubmit={async (formData, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				const isWeighing =
					formData.unit_of_measurement === unitOfMeasurementTypes.WEIGHING;

				let data = {
					...formData,
					id: product?.id,
					cost_per_piece: formatRemoveCommas(formData.cost_per_piece || 0),
					cost_per_bulk: formatRemoveCommas(formData.cost_per_bulk || 0),
					price_per_piece: formatRemoveCommas(formData.price_per_piece || 0),
					price_per_bulk: formatRemoveCommas(formData.price_per_bulk || 0),
					product_category: formData.product_category,
					has_quantity_allowance: isWeighing
						? formData.has_quantity_allowance
						: product?.has_quantity_allowance,
					allowable_spoilage: isWeighing ? formData.allowable_spoilage : null,
					will_carry_over_allowable_spoilage: undefined,

					// NOTE: Branch product values
					checking: undefined,
					is_daily_checked: undefined,
					is_randomly_checked: undefined,
					is_sold_in_branch: undefined,
					markdown_price_per_piece1: undefined,
					markdown_price_per_piece2: undefined,
					markdown_price_per_bulk1: undefined,
					markdown_price_per_bulk2: undefined,
					will_carry_over_checking: undefined,
					will_carry_over_is_sold_in_branch: undefined,
					will_carry_over_markdown_price_per_piece1: undefined,
					will_carry_over_markdown_price_per_bulk1: undefined,
					will_carry_over_markdown_price_per_piece2: undefined,
					will_carry_over_markdown_price_per_bulk2: undefined,

					will_carry_over_max_balance: undefined,
					will_carry_over_reorder_point: undefined,
					will_carry_over_price_per_piece: undefined,
					will_carry_over_price_per_bulk: undefined,
					will_carry_over_cost_per_piece: undefined,
					will_carry_over_cost_per_bulk: undefined,
				};

				if (product) {
					data = {
						...data,
						is_sold_in_branch: formData.will_carry_over_is_sold_in_branch
							? formData.is_sold_in_branch
							: undefined,
						markdown_price_per_piece1:
							formData.will_carry_over_markdown_price_per_piece1
								? formData.markdown_price_per_piece1
								: undefined,
						markdown_price_per_piece2:
							formData.will_carry_over_markdown_price_per_piece2
								? formData.markdown_price_per_piece2
								: undefined,
						markdown_price_per_bulk1:
							formData.will_carry_over_markdown_price_per_bulk1
								? formData.markdown_price_per_bulk1
								: undefined,
						markdown_price_per_bulk2:
							formData.will_carry_over_markdown_price_per_bulk2
								? formData.markdown_price_per_bulk2
								: undefined,
					};

					if (formData.will_carry_over_checking && formData.checking) {
						data = {
							...data,
							is_daily_checked:
								formData.checking === productCheckingTypes.DAILY,
							is_randomly_checked:
								formData.checking === productCheckingTypes.RANDOM,
						};
					}
				}

				onSubmit(data, resetForm);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col sm={6} xs={24}>
							{renderInputField({
								name: 'barcode',
								label: 'Barcode',
								setFieldValue,
								values,
							})}
						</Col>

						<Col sm={6} xs={24}>
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
								name: 'print_details',
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
								id="product_category"
								options={getProductCategoriesOptions()}
							/>
							<ErrorMessage
								name="product_category"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label label="Include In Scale" spacing />
							<FormRadioButton
								id="is_shown_in_scale_list"
								items={booleanOptions}
							/>
							<ErrorMessage
								name="is_shown_in_scale_list"
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
							<Label label="TT-002" spacing />
							<FormRadioButton
								id="unit_of_measurement"
								items={unitOfMeasurementOptions}
							/>
							<ErrorMessage
								name="unit_of_measurement"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label label="TT-003" spacing />
							<FormRadioButton
								id="is_vat_exempted"
								items={isVatExemptedOptions}
							/>
							<ErrorMessage
								name="is_vat_exempted"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label label="Qty Allowance" spacing />
							<FormRadioButton
								id="has_quantity_allowance"
								items={booleanOptions}
								disabled={
									values?.unit_of_measurement !==
									unitOfMeasurementTypes.WEIGHING
								}
							/>
							<ErrorMessage
								name="has_quantity_allowance"
								render={(error) => <FieldError error={error} />}
							/>
							{values?.unit_of_measurement !==
								unitOfMeasurementTypes.WEIGHING && (
								<FieldWarning message="Qty Allowance won't be included when submited" />
							)}
						</Col>

						<Divider dashed>QUANTITY</Divider>

						<Col sm={12} xs={24}>
							<Label label="Reorder Point" spacing />
							<FormInput
								type="number"
								id="reorder_point"
								isWholeNumber={
									values.unit_of_measurement ===
									unitOfMeasurementTypes.NON_WEIGHING
								}
							/>
							<ErrorMessage
								name="reorder_point"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label label="Max Balance" spacing />
							<FormInput
								type="number"
								id="max_balance"
								isWholeNumber={
									values.unit_of_measurement ===
									unitOfMeasurementTypes.NON_WEIGHING
								}
							/>
							<ErrorMessage
								name="max_balance"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'pieces_in_bulk',
								label: 'Pieces in Bulk',
								setFieldValue,
								values,
								type: inputTypes.NUMBER,
							})}
						</Col>

						<Col sm={12} xs={24}>
							<Label label="" spacing />
							{renderInputField({
								name: 'allowable_spoilage',
								label: 'Allowable Spoilage (%)',
								setFieldValue,
								values,
								type: inputTypes.NUMBER,
								options: {
									disabled:
										values?.unit_of_measurement !==
										unitOfMeasurementTypes.WEIGHING,
								},
							})}

							{values?.unit_of_measurement !==
								unitOfMeasurementTypes.WEIGHING && (
								<FieldWarning message="Allowable Spoilage won't be included when submited." />
							)}
						</Col>

						<Divider dashed>
							MONEY
							<br />
							<Text mark>(must be in 2 decimal places)</Text>
						</Divider>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'cost_per_piece',
								label: 'Cost (Piece)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'cost_per_bulk',
								label: 'Cost (Bulk)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'price_per_piece',
								label: 'Price (Piece)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'price_per_bulk',
								label: 'Price (Bulk)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>

						<Divider dashed>BRANCH PRODUCT SETTINGS</Divider>

						<Col sm={12} xs={24}>
							<Label label="In Stock" spacing />
							<FormRadioButton id="is_sold_in_branch" items={booleanOptions} />
							<ErrorMessage
								name="is_sold_in_branch"
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

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'markdown_price_per_piece1',
								label: 'Wholesale Price (Piece)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'markdown_price_per_piece2',
								label: 'Special Price (Piece)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'markdown_price_per_bulk1',
								label: 'Wholesale Price (Bulk)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'markdown_price_per_bulk2',
								label: 'Special Price (Bulk)',
								setFieldValue,
								values,
								type: inputTypes.MONEY,
							})}
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={loading || isSubmitting}
						/>
						<Button
							type="submit"
							text={product ? 'Edit' : 'Create'}
							variant="primary"
							loading={loading || isSubmitting}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
