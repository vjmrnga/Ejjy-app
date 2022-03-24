import { Table } from 'antd/';
import { ColumnsType } from 'antd/lib/table';
import { ErrorMessage, Form, Formik } from 'formik';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormCheckbox,
	FormInput,
} from '../../../../../components/elements';
import { unitOfMeasurementTypes } from '../../../../../global/types';
import { sleep } from '../../../../../utils/function';

const columns: ColumnsType = [
	{ title: '', dataIndex: 'selected', width: 50, align: 'center' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Returned Quantity', dataIndex: 'returned_quantity' },
	{ title: 'Received Quantity', dataIndex: 'received_quantity' },
	{ title: 'New Received Quantity', dataIndex: 'quantity', width: 200 },
];
interface Props {
	returnItemSlipProducts: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateAdjustmentSlipForm = ({
	returnItemSlipProducts,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: returnItemSlipProducts.map((item) => ({
				selected: true,
				id: item.id,
				newReceivedQuantity: null,
				unitOfMeasurement: item.unitOfMeasurement,
			})),
			Schema: Yup.array().of(
				Yup.object().shape({
					newReceivedQuantity: Yup.number()
						.when('selected', {
							is: true,
							then: Yup.number()
								.positive()
								.test(
									'is-whole-number',
									'Non-weighing items require whole number quantity.',
									function test(value) {
										// NOTE: We need to use a no-named function so
										// we can use 'this' and access the other form field value.

										// eslint-disable-next-line react/no-this-in-sfc
										return this.parent.unitOfMeasurement ===
											unitOfMeasurementTypes.NON_WEIGHING
											? isInteger(Number(value))
											: true;
									},
								)
								.required(),
							otherwise: Yup.number().notRequired(),
						})
						.nullable()
						.label('Qty'),
				}),
			),
		}),
		[returnItemSlipProducts],
	);

	const getQuantity = (index, values) => (
		<>
			<FormInput
				type="number"
				id={`${index}.newReceivedQuantity`}
				isWholeNumber={
					values?.[index]?.unitOfMeasurement ===
					unitOfMeasurementTypes.NON_WEIGHING
				}
				disabled={!values?.[index]?.selected || values?.[index]?.approved}
			/>
			<ErrorMessage
				name={`${index}.newReceivedQuantity`}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData: any) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);
				onSubmit(formData);
			}}
			enableReinitialize
		>
			{({ values }) => (
				<Form>
					<Table
						columns={columns}
						dataSource={returnItemSlipProducts.map((item, index) => ({
							key: item.id,
							selected: <FormCheckbox id={`${index}.selected`} />,
							name: item.name,
							returned_quantity: item.returnedQuantity,
							received_quantity: item.receivedQuantity,
							quantity: getQuantity(index, values),
						}))}
						scroll={{ x: 800 }}
						pagination={false}
						loading={loading}
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
							text="Create"
							variant="primary"
							loading={loading || isSubmitting}
							disabled={!returnItemSlipProducts.length}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
