/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-confusing-arrow */
/* eslint-disable newline-per-chained-call */
import { Checkbox, Col, Divider, Row, Typography } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInput,
	FormInputLabel,
	FormRadioButton,
	FormSelect,
	FormTextareaLabel,
	Label,
} from '../../../../components/elements';
import FieldWarning from '../../../../components/elements/FieldWarning/FieldWarning';
import {
	booleanOptions,
	checkingTypesOptions,
} from '../../../../global/options';
import {
	productCheckingTypes,
	productTypes,
	unitOfMeasurementTypes,
} from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { IProductCategory } from '../../../../models';
import {
	formatQuantity,
	removeCommas,
	sleep,
} from '../../../../utils/function';
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
				print_details: product?.name || '',
				description: product?.name || '',
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
				discounted_price_per_piece1: undefined,
				discounted_price_per_piece2: undefined,
				discounted_price_per_bulk1: undefined,
				discounted_price_per_bulk2: undefined,

				will_carry_over_checking: product ? false : undefined,
				will_carry_over_is_sold_in_branch: product ? false : undefined,
				will_carry_over_discounted_price_per_piece1: product
					? false
					: undefined,
				will_carry_over_discounted_price_per_bulk1: product ? false : undefined,
				will_carry_over_discounted_price_per_piece2: product
					? false
					: undefined,
				will_carry_over_discounted_price_per_bulk2: product ? false : undefined,
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
					discounted_price_per_piece1: Yup.number()
						.min(0)
						.label('Wholesale Price (piece)'),
					discounted_price_per_piece2: Yup.number()
						.min(0)
						.label('Special Price (piece)'),
					discounted_price_per_bulk1: Yup.number()
						.min(0)
						.label('Wholesale Price (bulk)'),
					discounted_price_per_bulk2: Yup.number()
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

	const renderCarryOverFieldLabel = useCallback(
		(inputName, label, checkboxName, setFieldValue, disabledCheckbox = false) =>
			product ? (
				<Checkbox
					className="CreateEditProduct_carryOverCheckbox"
					onChange={(e) => {
						setFieldValue(checkboxName, e.target.checked);
					}}
					disabled={disabledCheckbox}
				>
					{label}
				</Checkbox>
			) : (
				<Label id={inputName} label={label} spacing />
			),
		[product],
	);

	const renderCarryOverFieldNote = useCallback(
		(carryOverCheckboxValue, fieldName) =>
			product &&
			carryOverCheckboxValue && (
				<FieldWarning
					message={`${fieldName} value will be carried over to branches when submited.`}
				/>
			),
		[product],
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
					cost_per_piece: removeCommas(formData.cost_per_piece || 0),
					cost_per_bulk: removeCommas(formData.cost_per_bulk || 0),
					price_per_piece: removeCommas(formData.price_per_piece || 0),
					price_per_bulk: removeCommas(formData.price_per_bulk || 0),
					product_category: formData.product_category,
					has_quantity_allowance: isWeighing
						? formData.has_quantity_allowance
						: product?.has_quantity_allowance,
					allowable_spoilage: isWeighing ? formData.allowable_spoilage : null,
					will_carry_over_allowable_spoilage: isWeighing
						? formData.will_carry_over_allowable_spoilage
						: false,

					// NOTE: Branch product values
					checking: undefined,
					is_daily_checked: undefined,
					is_randomly_checked: undefined,
					is_sold_in_branch: undefined,
					discounted_price_per_piece1: undefined,
					discounted_price_per_piece2: undefined,
					discounted_price_per_bulk1: undefined,
					discounted_price_per_bulk2: undefined,
					will_carry_over_checking: undefined,
					will_carry_over_is_sold_in_branch: undefined,
					will_carry_over_discounted_price_per_piece1: undefined,
					will_carry_over_discounted_price_per_bulk1: undefined,
					will_carry_over_discounted_price_per_piece2: undefined,
					will_carry_over_discounted_price_per_bulk2: undefined,
				};

				if (formData.is_sold_in_branch) {
					data = {
						...data,
						is_sold_in_branch: formData.will_carry_over_is_sold_in_branch
							? formData.is_sold_in_branch
							: undefined,
						discounted_price_per_piece1:
							formData.will_carry_over_discounted_price_per_piece1
								? formData.discounted_price_per_piece1
								: undefined,
						discounted_price_per_piece2:
							formData.will_carry_over_discounted_price_per_piece2
								? formData.discounted_price_per_piece2
								: undefined,
						discounted_price_per_bulk1:
							formData.will_carry_over_discounted_price_per_bulk1
								? formData.discounted_price_per_bulk1
								: undefined,
						discounted_price_per_bulk2:
							formData.will_carry_over_discounted_price_per_bulk2
								? formData.discounted_price_per_bulk2
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
					<Row gutter={[15, 15]}>
						<Col sm={6} xs={24}>
							<FormInputLabel id="barcode" label="Barcode" />
							<ErrorMessage
								name="barcode"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={6} xs={24}>
							<FormInputLabel id="textcode" label="Textcode" />
							<ErrorMessage
								name="textcode"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel id="name" label="Name" />
							<ErrorMessage
								name="name"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<FormTextareaLabel id="print_details" label="Print Details" />
							<ErrorMessage
								name="print_details"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<FormTextareaLabel id="description" label="Description" />
							<ErrorMessage
								name="description"
								render={(error) => <FieldError error={error} />}
							/>
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
							{renderCarryOverFieldLabel(
								'reorder_point',
								'Reorder Point',
								'will_carry_over_reorder_point',
								setFieldValue,
							)}
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
							{renderCarryOverFieldNote(
								values.will_carry_over_reorder_point,
								'Reorder Point',
							)}
						</Col>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'max_balance',
								'Max Balance',
								'will_carry_over_max_balance',
								setFieldValue,
							)}
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
							{renderCarryOverFieldNote(
								values.will_carry_over_max_balance,
								'Max Balance',
							)}
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="pieces_in_bulk"
								label="Pieces in Bulk"
							/>
							<ErrorMessage
								name="pieces_in_bulk"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'allowable_spoilage',
								'Allowable Spoilage (%)',
								'will_carry_over_allowable_spoilage',
								setFieldValue,
								values?.unit_of_measurement !== unitOfMeasurementTypes.WEIGHING,
							)}
							<FormInput
								type="number"
								id="allowable_spoilage"
								disabled={
									values?.unit_of_measurement !==
									unitOfMeasurementTypes.WEIGHING
								}
							/>
							<ErrorMessage
								name="allowable_spoilage"
								render={(error) => <FieldError error={error} />}
							/>
							{values?.unit_of_measurement !==
								unitOfMeasurementTypes.WEIGHING && (
								<FieldWarning message="Allowable Spoilage won't be included when submited." />
							)}
							{renderCarryOverFieldNote(
								values.will_carry_over_allowable_spoilage,
								'Allowable Spoilage',
							)}
						</Col>

						<Divider dashed>
							MONEY
							<br />
							<Text mark>(must be in 2 decimal places)</Text>
						</Divider>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'cost_per_piece',
								'Cost (Piece)',
								'will_carry_over_cost_per_piece',
								setFieldValue,
							)}
							<FormInput type="number" id="cost_per_piece" isMoney />
							<ErrorMessage
								name="cost_per_piece"
								render={(error) => <FieldError error={error} />}
							/>
							{renderCarryOverFieldNote(
								values.will_carry_over_cost_per_piece,
								'Cost (Piece)',
							)}
						</Col>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'cost_per_bulk',
								'Cost (Bulk)',
								'will_carry_over_cost_per_bulk',
								setFieldValue,
							)}
							<FormInput type="number" id="cost_per_bulk" isMoney />
							<ErrorMessage
								name="cost_per_bulk"
								render={(error) => <FieldError error={error} />}
							/>
							{renderCarryOverFieldNote(
								values.will_carry_over_cost_per_bulk,
								'Cost (Bulk)',
							)}
						</Col>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'price_per_piece',
								'Price (Piece)',
								'will_carry_over_price_per_piece',
								setFieldValue,
							)}
							<FormInput type="number" id="price_per_piece" isMoney />
							<ErrorMessage
								name="price_per_piece"
								render={(error) => <FieldError error={error} />}
							/>
							{renderCarryOverFieldNote(
								values.will_carry_over_price_per_piece,
								'Price (Piece)',
							)}
						</Col>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'price_per_bulk',
								'Price (Bulk)',
								'will_carry_over_price_per_bulk',
								setFieldValue,
							)}
							<FormInput type="number" id="price_per_bulk" isMoney />
							<ErrorMessage
								name="price_per_bulk"
								render={(error) => <FieldError error={error} />}
							/>
							{renderCarryOverFieldNote(
								values.will_carry_over_price_per_bulk,
								'Price (Bulk)',
							)}
						</Col>

						<Divider dashed>BRANCH PRODUCT SETTINGS</Divider>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'is_sold_in_branch',
								'In Stock',
								'will_carry_over_is_sold_in_branch',
								setFieldValue,
							)}
							<FormRadioButton
								id="is_sold_in_branch"
								items={booleanOptions}
								disabled={!values.will_carry_over_is_sold_in_branch}
							/>
							<ErrorMessage
								name="is_sold_in_branch"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'checking',
								'Checking',
								'will_carry_over_checking',
								setFieldValue,
								!values.is_sold_in_branch ||
									!values.will_carry_over_is_sold_in_branch,
							)}
							<FormRadioButton
								id="checking"
								items={checkingTypesOptions}
								disabled={
									!values.is_sold_in_branch ||
									!values.will_carry_over_is_sold_in_branch ||
									!values.will_carry_over_checking
								}
							/>
							<ErrorMessage
								name="checking"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'discounted_price_per_piece1',
								'Wholesale Price (piece)',
								'will_carry_over_discounted_price_per_piece1',
								setFieldValue,
								!values.is_sold_in_branch ||
									!values.will_carry_over_is_sold_in_branch,
							)}
							<FormInput
								type="number"
								id="discounted_price_per_piece1"
								step=".01"
								disabled={
									!values.is_sold_in_branch ||
									!values.will_carry_over_is_sold_in_branch ||
									!values.will_carry_over_discounted_price_per_piece1
								}
								isMoney
							/>
							<ErrorMessage
								name="discounted_price_per_piece1"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'discounted_price_per_piece2',
								'Special Price (piece)',
								'will_carry_over_discounted_price_per_piece2',
								setFieldValue,
								!values.is_sold_in_branch ||
									!values.will_carry_over_is_sold_in_branch,
							)}
							<FormInput
								type="number"
								id="discounted_price_per_piece2"
								step=".01"
								disabled={
									!values.is_sold_in_branch ||
									!values.will_carry_over_is_sold_in_branch ||
									!values.will_carry_over_discounted_price_per_piece2
								}
								isMoney
							/>
							<ErrorMessage
								name="discounted_price_per_piece2"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'discounted_price_per_bulk1',
								'Wholesale Price (bulk)',
								'will_carry_over_discounted_price_per_bulk1',
								setFieldValue,
								!values.is_sold_in_branch ||
									!values.will_carry_over_is_sold_in_branch,
							)}
							<FormInput
								type="number"
								id="discounted_price_per_bulk1"
								step=".01"
								disabled={
									!values.is_sold_in_branch ||
									!values.will_carry_over_is_sold_in_branch ||
									!values.will_carry_over_discounted_price_per_bulk1
								}
								isMoney
							/>
							<ErrorMessage
								name="discounted_price_per_bulk1"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							{renderCarryOverFieldLabel(
								'discounted_price_per_bulk2',
								'Special Price (bulk)',
								'will_carry_over_discounted_price_per_bulk2',
								setFieldValue,
								!values.is_sold_in_branch ||
									!values.will_carry_over_is_sold_in_branch,
							)}
							<FormInput
								type="number"
								id="discounted_price_per_bulk2"
								step=".01"
								disabled={
									!values.is_sold_in_branch ||
									!values.will_carry_over_is_sold_in_branch ||
									!values.will_carry_over_discounted_price_per_bulk2
								}
								isMoney
							/>
							<ErrorMessage
								name="discounted_price_per_bulk2"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							classNames="mr-10"
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
