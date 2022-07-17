import { FieldArray, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { getDeliveryReceiptStatus, sleep } from 'utils';
import { TableNormal } from '../../../../../components';
import {
	Button,
	FieldError,
	FormCheckbox,
	FormInput,
} from '../../../../../components/elements';

const columns = [
	{ name: '', width: '80px' },
	{ name: 'Name' },
	{ name: 'Status' },
	{ name: 'Current Delivered', width: '120px', center: true },
	{ name: 'New Delivered', width: '150px', center: true },
	{ name: 'Current Received', width: '120px', center: true },
	{ name: 'New Received', width: '150px', center: true },
];

interface Props {
	deliveryReceiptProducts: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateAdjustmentSlipForm = ({
	deliveryReceiptProducts,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				deliveryReceiptProducts: deliveryReceiptProducts.map((drProduct) => ({
					selected: true,
					is_adjusted: drProduct.is_adjusted,
					delivery_receipt_product_id: drProduct.id,
					new_delivered_quantity_piece: null,
					new_received_quantity_piece: null,
				})),
			},
			Schema: Yup.object().shape({
				deliveryReceiptProducts: Yup.array().of(
					Yup.object().shape({
						new_delivered_quantity_piece: Yup.number()
							.when('selected', {
								is: true,
								then: Yup.number().positive(),
								otherwise: Yup.number().notRequired(),
							})
							.nullable()
							.label('Qty'),
						new_received_quantity_piece: Yup.number()
							.when('selected', {
								is: true,
								then: Yup.number().positive(),
								otherwise: Yup.number().notRequired(),
							})
							.nullable()
							.label('Qty'),
					}),
				),
			}),
		}),
		[deliveryReceiptProducts],
	);

	const getSelectRadioButton = (index) => (
		<FormCheckbox id={`deliveryReceiptProducts.${index}.selected`} />
	);

	const getQuantity = (index, key, values, touched, errors) => (
		<>
			<FormInput
				disabled={!values?.deliveryReceiptProducts?.[index]?.selected}
				id={`deliveryReceiptProducts.${index}.${key}`}
				type="number"
			/>
			{errors?.deliveryReceiptProducts?.[index]?.[key] &&
			touched?.deliveryReceiptProducts?.[index]?.[key] ? (
				<FieldError error={errors?.deliveryReceiptProducts?.[index]?.[key]} />
			) : null}
		</>
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
			{({ values, errors, touched }) => (
				<FieldArray
					name="requestedProducts"
					render={() => (
						<Form className="form">
							<TableNormal
								columns={columns}
								data={deliveryReceiptProducts.map((drProduct, index) => [
									// Select
									getSelectRadioButton(index),
									// Name
									drProduct?.name,
									// Status
									getDeliveryReceiptStatus(
										`${drProduct.status}-${drProduct.is_adjusted}`,
										drProduct.status,
										drProduct.is_adjusted,
									),
									// Current Delivered
									drProduct?.delivered_quantity_piece,
									// New Delivered
									getQuantity(
										index,
										'new_delivered_quantity_piece',
										values,
										touched,
										errors,
									),
									// Current Received
									drProduct?.received_quantity_piece,
									// New Received
									getQuantity(
										index,
										'new_received_quantity_piece',
										values,
										touched,
										errors,
									),
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
									disabled={!deliveryReceiptProducts.length}
									loading={loading || isSubmitting}
									text="Create"
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
