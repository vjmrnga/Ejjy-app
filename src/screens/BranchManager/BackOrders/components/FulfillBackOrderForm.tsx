/* eslint-disable react/no-this-in-sfc */
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ErrorMessage, Form, Formik } from 'formik';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInput,
	FormSelect,
} from '../../../../components/elements';
import { quantityTypeOptions } from '../../../../global/options';
import {
	quantityTypes,
	unitOfMeasurementTypes,
} from '../../../../global/types';
import { sleep } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Quantity Received', dataIndex: 'quantity' },
];

interface Props {
	backOrder: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const FulfillBackOrderForm = ({
	backOrder,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: backOrder.products.map((product) => ({
				product_id: product.product.id,
				name: product.product.name,
				piecesInBulk: product.product.pieces_in_bulk,
				quantity: '',
				quantityType: quantityTypes.PIECE,
				unitOfMeasurement: product.product.unit_of_measurement,
			})),
			Schema: Yup.array().of(
				Yup.object().shape({
					quantity: Yup.number()
						.required()
						.nullable()
						.min(0)
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

								const { unitOfMeasurement, quantityType } = this.parent;

								const isWeighingPiece =
									unitOfMeasurement === unitOfMeasurementTypes.WEIGHING &&
									quantityType === quantityTypes.PIECE;

								if (!isWeighingPiece) {
									return isInteger(Number(value));
								}

								return true;
							},
						)
						.label('Quantity'),
				}),
			),
		}),
		[backOrder],
	);

	const renderQuantity = (fieldKey, values) => {
		const { quantityType, unitOfMeasurement } = values;

		return (
			<>
				<div className="QuantityContainer">
					<FormInput
						type="number"
						id={`${fieldKey}.quantity`}
						isWholeNumber={
							!(
								quantityType === quantityTypes.PIECE &&
								unitOfMeasurement === unitOfMeasurementTypes.WEIGHING
							)
						}
					/>
					<FormSelect
						id={`${fieldKey}.quantityType`}
						options={quantityTypeOptions}
					/>
				</div>
				<ErrorMessage
					name={`${fieldKey}.quantity`}
					render={(error) => <FieldError error={error} />}
				/>
			</>
		);
	};

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(formData, resetForm);
			}}
			enableReinitialize
		>
			{({ values }) => (
				<Form>
					<Table
						columns={columns}
						dataSource={backOrder.products.map((product, index) => ({
							key: product.id,
							name: product.product.name,
							quantity: renderQuantity(index, values[index]),
						}))}
						pagination={false}
						loading={loading || isSubmitting}
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
							text="Fulfill"
							variant="primary"
							loading={loading || isSubmitting}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
