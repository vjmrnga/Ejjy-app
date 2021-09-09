/* eslint-disable newline-per-chained-call */
import { Col, Divider, Row, Typography } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInputLabel,
	FormRadioButton,
	FormSelect,
	FormTextareaLabel,
	Label,
} from '../../../../components/elements';
import FieldWarning from '../../../../components/elements/FieldWarning/FieldWarning';
import { booleanOptions } from '../../../../global/options';
import { productTypes, unitOfMeasurementTypes } from '../../../../global/types';
import { IProductCategory } from '../../../../models';
import { removeCommas, sleep } from '../../../../utils/function';
import { useAuth } from '../../../../hooks/useAuth';

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

const unitOfMeasurement = [
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

const isVatExemptedTypes = [
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
				reorder_point: product?.reorder_point,
				max_balance: product?.max_balance,
				price_per_piece: product?.price_per_piece || '',
				price_per_bulk: product?.price_per_bulk || '',
				product_category: product?.product_category,
				is_vat_exempted: product?.is_vat_exempted?.toString() || 'false',
				is_shown_in_scale_list: product?.is_shown_in_scale_list || false,
				has_quantity_allowance: product?.has_quantity_allowance || false,
			},
			Schema: Yup.object().shape(
				{
					// barcode: Yup.string()
					// 	.max(50, 'Barcode/Textcode must be at most 50 characters')
					// 	.test(
					// 		'notBothAtTheSameTime',
					// 		'You can only input either barcode or textcode',
					// 		function (barcode) {
					// 			return !(this.parent.textcode && barcode);
					// 		},
					// 	)
					// 	.when('textcode', {
					// 		is: (value) => !value?.length,
					// 		then: Yup.string().required('Barcode/Textcode is a required field'),
					// 	}),
					// textcode: Yup.string()
					// 	.max(50, 'Barcode/Textcode must be at most 50 characters')
					// 	.test(
					// 		'notBothAtTheSameTime',
					// 		'You can only input either barcode or textcode',
					// 		function (textcode) {
					// 			return !(this.parent.barcode && textcode);
					// 		},
					// 	)
					// 	.when('barcode', {
					// 		is: (value) => !value?.length,
					// 		then: Yup.string().required('Barcode/Textcode is a required field'),
					// 	}),
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
						.min(0)
						.max(65535)
						.label('Reorder Point'),
					max_balance: Yup.number()
						.required()
						.min(0)
						.max(65535)
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

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(
					{
						...formData,
						id: product?.id,
						cost_per_piece: removeCommas(formData.cost_per_piece || 0),
						cost_per_bulk: removeCommas(formData.cost_per_bulk || 0),
						price_per_piece: removeCommas(formData.price_per_piece || 0),
						price_per_bulk: removeCommas(formData.price_per_bulk || 0),
						product_category: formData.product_category,
						has_quantity_allowance:
							formData.unit_of_measurement === unitOfMeasurementTypes.WEIGHING
								? formData.has_quantity_allowance
								: product?.has_quantity_allowance,
						allowable_spoilage:
							formData.unit_of_measurement === unitOfMeasurementTypes.WEIGHING
								? formData.allowable_spoilage
								: null,
					},
					resetForm,
				);
			}}
			enableReinitialize
		>
			{({ values }) => (
				<Form className="form">
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
								items={unitOfMeasurement}
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
								items={isVatExemptedTypes}
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
							<FormInputLabel
								min={0}
								type="number"
								id="reorder_point"
								label="Reorder Point"
							/>
							<ErrorMessage
								name="reorder_point"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								min={0}
								type="number"
								id="max_balance"
								label="Max Balance"
							/>
							<ErrorMessage
								name="max_balance"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								min={0}
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
							<FormInputLabel
								min={0}
								max={99}
								type="number"
								id="allowable_spoilage"
								label="Allowable Spoilage (%)"
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
								<FieldWarning message="Allowable Spoilage won't be included when submited" />
							)}
						</Col>

						<Divider dashed>
							MONEY
							<br />
							<Text mark>(must be in 2 decimal places)</Text>
						</Divider>

						<Col sm={12} xs={24}>
							<FormInputLabel
								id="cost_per_piece"
								label="Cost (Piece)"
								isMoney
							/>
							<ErrorMessage
								name="cost_per_piece"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel id="cost_per_bulk" label="Cost (Bulk)" isMoney />
							<ErrorMessage
								name="cost_per_bulk"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								id="price_per_piece"
								label="Price (Piece)"
								isMoney
							/>
							<ErrorMessage
								name="price_per_piece"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								id="price_per_bulk"
								label="Price (Bulk)"
								isMoney
							/>
							<ErrorMessage
								name="price_per_bulk"
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
