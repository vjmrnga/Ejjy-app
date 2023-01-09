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
	{ title: 'Select', dataIndex: 'selected', width: 50, align: 'center' },
	{ title: 'Approve', dataIndex: 'approved', width: 50, align: 'center' },
	{ title: 'Code', dataIndex: 'code' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Fulfilled Quantity', dataIndex: 'fulfilled_quantity' },
	{ title: 'New Quantity', dataIndex: 'quantity', width: 200 },
];
interface Props {
	preparationSlipProducts: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateAdjustmentSlipForm = ({
	preparationSlipProducts,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: preparationSlipProducts.map((item) => ({
				selected: true,
				approved: false,
				id: item.id,
				code: item.code,
				name: item.name,
				newFulfilledQuantityPiece: null,
				hasQuantityAllowance: item.hasQuantityAllowance,
				unitOfMeasurement: item.unitOfMeasurement,
			})),
			Schema: Yup.array().of(
				Yup.object().shape({
					newFulfilledQuantityPiece: Yup.number()
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
		[preparationSlipProducts],
	);

	const getQuantity = (index, values) => (
		<>
			<FormInput
				disabled={!values?.[index]?.selected || values?.[index]?.approved}
				id={`${index}.newFulfilledQuantityPiece`}
				isWholeNumber={
					values?.[index]?.unitOfMeasurement ===
					unitOfMeasurementTypes.NON_WEIGHING
				}
				type="number"
			/>
			<ErrorMessage
				name={`${index}.newFulfilledQuantityPiece`}
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
			{({ values, setFieldValue }) => (
				<Form>
					<Table
						columns={columns}
						dataSource={preparationSlipProducts.map((item, index) => ({
							key: item.id,
							selected: (
								<FormCheckbox
									id={`${index}.selected`}
									onChange={(value) => {
										if (value) {
											setFieldValue(`${index}.approved`, false);
										}
									}}
								/>
							),
							approved: item.hasQuantityAllowance ? (
								<FormCheckbox
									id={`${index}.approved`}
									onChange={(value) => {
										if (value) {
											setFieldValue(`${index}.selected`, false);
											setFieldValue(`${index}.newFulfilledQuantityPiece`, '');
										}
									}}
								/>
							) : null,
							code: item.code,
							name: item.name,
							fulfilled_quantity: item.fulfilledQuantityPiece,
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
							disabled={!preparationSlipProducts.length}
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
