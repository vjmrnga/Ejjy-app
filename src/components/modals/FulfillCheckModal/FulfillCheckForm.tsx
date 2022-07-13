import { TableNormal } from 'components';
import { Button, FieldError, FormInput, FormSelect } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { quantityTypeOptions, quantityTypes } from 'global';
import React, { useCallback } from 'react';
import { getProductCode } from 'utils';
import * as Yup from 'yup';

const columns = [
	{ name: 'Code' },
	{ name: 'Name' },
	{ name: 'Quantity', width: '200px' },
];

interface Props {
	products: any;
	onSubmit: any;
	onClose: any;
	isLoading: boolean;
}

export const FulfillCheckForm = ({
	products,
	onSubmit,
	onClose,
	isLoading,
}: Props) => {
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				products: products.map((product) => ({
					productCheckProductId: product.product_check_product_id,
					piecesInBulk: product.pieces_in_bulk,
					quantityType: quantityTypes.PIECE,
					fulfilledQuantityPiece: 0,
				})),
			},
			Schema: Yup.object().shape({
				products: Yup.array().of(
					Yup.object().shape({
						fulfilledQuantityPiece: Yup.number().min(0).required().label('Qty'),
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
					id={`products.${index}.fulfilledQuantityPiece`}
				/>
				<FormSelect
					id={`products.${index}.quantityType`}
					options={quantityTypeOptions}
				/>
			</div>
			<ErrorMessage
				name={`products.${index}.fulfilledQuantityPiece`}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
			enableReinitialize
		>
			<Form>
				<TableNormal
					columns={columns}
					data={products.map((product, index) => [
						// Code
						getProductCode(product),
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
						disabled={isLoading}
					/>
					<Button
						type="submit"
						text="Submit"
						variant="primary"
						loading={isLoading}
					/>
				</div>
			</Form>
		</Formik>
	);
};
