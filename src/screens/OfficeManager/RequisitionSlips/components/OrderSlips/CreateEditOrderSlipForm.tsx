/* eslint-disable react/no-this-in-sfc */
import { ErrorMessage, FieldArray, Form, Formik } from 'formik';
import { isInteger, min } from 'lodash';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { sleep } from 'utils';
import { TableNormal } from '../../../../../components';
import {
	Button,
	FieldError,
	FormCheckbox,
	FormInput,
	FormSelect,
} from '../../../../../components/elements';
import { quantityTypeOptions } from '../../../../../global/options';
import {
	quantityTypes,
	unitOfMeasurementTypes,
} from '../../../../../global/types';

const columns = [
	{ name: '', width: '50px' },
	{ name: 'Barcode' },
	{ name: 'Name' },
	{ name: 'Quantity', width: '250px' },
	{ name: 'Qty Reqstd', tooltip: 'Quantity Requested' },
	{ name: 'Balance', tooltip: "Assigned branch's remaining balance" },
	{ name: 'Assigned Personnel' },
];

interface Props {
	orderSlip: any;
	requestedProducts: any;
	assignedPersonnelOptions: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateEditOrderSlipForm = ({
	orderSlip,
	requestedProducts,
	assignedPersonnelOptions,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				requestedProducts: requestedProducts.map((requestedProduct) => ({
					selected: requestedProduct?.selected,
					order_slip_product_id: requestedProduct?.order_slip_product_id,
					quantity: requestedProduct?.quantity,
					quantity_type: requestedProduct?.quantity_type,
					product_id: requestedProduct?.product_id,
					assigned_personnel: requestedProduct?.assigned_personnel,
					pieces_in_bulk: requestedProduct?.product_pieces_in_bulk,
					unit_of_measurement: requestedProduct?.product?.unit_of_measurement,
				})),
			},
			Schema: Yup.object().shape({
				requestedProducts: Yup.array().of(
					Yup.object().shape({
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
						assigned_personnel: Yup.number().when('selected', {
							is: true,
							then: Yup.number().required('Personnel required'),
							otherwise: Yup.number().notRequired(),
						}),
					}),
				),
			}),
		}),
		[requestedProducts],
	);

	const getSelectRadioButton = (index) => (
		<FormCheckbox id={`requestedProducts.${index}.selected`} />
	);

	const getQuantity = (index, values, maxPiece, maxBulk) => {
		const product = values?.requestedProducts?.[index] || {};

		return (
			<>
				<div className="QuantityContainer">
					<FormInput
						disabled={!product.selected}
						id={`requestedProducts.${index}.quantity`}
						isWholeNumber={
							!(
								product?.quantity_type === quantityTypes.PIECE &&
								product.unit_of_measurement === unitOfMeasurementTypes.WEIGHING
							)
						}
						max={
							product.quantity_type === quantityTypes.PIECE ? maxPiece : maxBulk
						}
						type="number"
					/>
					<FormSelect
						disabled={!product.selected}
						id={`requestedProducts.${index}.quantity_type`}
						options={quantityTypeOptions}
					/>
				</div>
				<ErrorMessage
					name={`requestedProducts.${index}.quantity`}
					render={(error) => <FieldError error={error} />}
				/>
			</>
		);
	};

	const getOrdered = (index, quantity_piece, quantity_bulk, values) => {
		const quantityType = values?.requestedProducts?.[index]?.quantity_type;

		return quantityType === quantityTypes.PIECE ? (
			<span>{quantity_piece}</span>
		) : (
			<span>{quantity_bulk}</span>
		);
	};

	const getBalance = (
		index,
		branch_current,
		branch_max_balance,
		branch_current_bulk,
		branch_max_balance_bulk,
		values,
	) => {
		const quantityType = values?.requestedProducts?.[index]?.quantity_type;

		return quantityType === quantityTypes.PIECE ? (
			<span>{`${branch_current} / ${branch_max_balance}`}</span>
		) : (
			<span>{`${branch_current_bulk} / ${branch_max_balance_bulk}`}</span>
		);
	};

	const getAssignedPersonnel = (index, values) => (
		<FormSelect
			disabled={!values?.requestedProducts?.[index]?.selected}
			id={`requestedProducts.${index}.assigned_personnel`}
			options={assignedPersonnelOptions}
		/>
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			enableReinitialize
			onSubmit={async (formData: any) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);
				onSubmit(formData);
			}}
		>
			{({ values }) => (
				<FieldArray
					name="requestedProducts"
					render={() => (
						<Form className="form">
							<TableNormal
								columns={columns}
								data={requestedProducts.map((requestedProduct, index) => [
									// Select
									getSelectRadioButton(index),
									// Barcode
									requestedProduct?.product_barcode ||
										requestedProduct?.product_textcode,
									// Name
									requestedProduct?.product_name,
									// Quantity / Bulk | Pieces
									getQuantity(
										index,
										values,
										min([
											requestedProduct?.branch_current,
											requestedProduct?.ordered_quantity_piece,
										]),
										min([
											requestedProduct?.branch_current_bulk,
											requestedProduct?.ordered_quantity_bulk,
										]),
									),
									// Order / Bulk | Pieces
									getOrdered(
										index,
										requestedProduct?.ordered_quantity_piece,
										requestedProduct?.ordered_quantity_bulk,
										values,
									),
									// Current Balance
									getBalance(
										index,
										requestedProduct?.branch_current,
										requestedProduct?.branch_max_balance,
										requestedProduct?.branch_current_bulk,
										requestedProduct?.branch_max_balance_bulk,
										values,
									),
									// Assigned Personnel
									getAssignedPersonnel(index, values),
								])}
								loading={loading}
							/>

							<div className="ModalCustomFooter">
								<Button
									disabled={loading || isSubmitting}
									text="Cancel"
									type="button"
									onClick={onClose}
								/>
								<Button
									disabled={!requestedProducts.length}
									loading={loading || isSubmitting}
									text={orderSlip ? 'Edit' : 'Create'}
									type="submit"
									variant="primary"
								/>
							</div>
						</Form>
					)}
				/>
			)}
		</Formik>
	);
};
