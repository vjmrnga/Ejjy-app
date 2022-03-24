import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { TableNormal } from '../../../../components';
import {
	Button,
	FieldError,
	FormInput,
	FormSelect,
} from '../../../../components/elements';
import { quantityTypeOptions } from '../../../../global/options';
import { quantityTypes } from '../../../../global/types';
import { sleep } from '../../../../utils/function';

const columns = [
	{ name: 'Code' },
	{ name: 'Name' },
	{ name: 'Quantity', width: '200px' },
];

interface Props {
	products: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const FulfillCheckForm = ({
	products,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				products: products.map((product) => ({
					product_check_product_id: product.product_check_product_id,
					pieces_in_bulk: product.pieces_in_bulk,
					quantity_type: quantityTypes.PIECE,
					fulfilled_quantity_piece: 0,
				})),
			},
			Schema: Yup.object().shape({
				products: Yup.array().of(
					Yup.object().shape({
						fulfilled_quantity_piece: Yup.number()
							.min(0)
							.required()
							.label('Qty'),
					}),
				),
			}),
		}),
		[products],
	);

	const getFulfilledQuantity = (index) => (
		<>
			<div className="QuantityContainer">
				<FormInput
					type="number"
					id={`products.${index}.fulfilled_quantity_piece`}
				/>
				<FormSelect
					id={`products.${index}.quantity_type`}
					options={quantityTypeOptions}
				/>
			</div>
			<ErrorMessage
				name={`products.${index}.fulfilled_quantity_piece`}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);
				onSubmit(formData);
			}}
			enableReinitialize
		>
			<Form>
				<TableNormal
					columns={columns}
					data={products.map((product, index) => [
						// Code
						product?.barcode || product?.textcode,
						// Name
						product?.name,
						// Quantity / Bulk | Pieces
						getFulfilledQuantity(index),
					])}
				/>

				<div className="ModalCustomFooter">
					<Button
						type="button"
						text="Cancel"
						onClick={onClose}
						disabled={loading || isSubmitting}
					/>
					<Button
						type="submit"
						text="Submit"
						variant="primary"
						loading={loading || isSubmitting}
					/>
				</div>
			</Form>
		</Formik>
	);
};
