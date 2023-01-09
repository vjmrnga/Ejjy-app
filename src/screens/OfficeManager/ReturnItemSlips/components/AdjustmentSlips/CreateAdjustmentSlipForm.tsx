import { Table } from 'antd/';
import { ColumnsType } from 'antd/lib/table';
import { ErrorMessage, Form, Formik } from 'formik';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { sleep } from 'utils';
import {
	Button,
	FieldError,
	FormCheckbox,
	FormInput,
} from '../../../../../components/elements';
import { unitOfMeasurementTypes } from '../../../../../global/types';

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
				disabled={!values?.[index]?.selected || values?.[index]?.approved}
				id={`${index}.newReceivedQuantity`}
				isWholeNumber={
					values?.[index]?.unitOfMeasurement ===
					unitOfMeasurementTypes.NON_WEIGHING
				}
				type="number"
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
			enableReinitialize
			onSubmit={async (formData: any) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);
				onSubmit(formData);
			}}
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
						loading={loading}
						pagination={false}
						scroll={{ x: 800 }}
						bordered
					/>

					<div className="ModalCustomFooter">
						<Button
							disabled={loading || isSubmitting}
							text="Cancel"
							type="button"
							onClick={onClose}
						/>
						<Button
							disabled={!returnItemSlipProducts.length}
							loading={loading || isSubmitting}
							text="Create"
							type="submit"
							variant="primary"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
