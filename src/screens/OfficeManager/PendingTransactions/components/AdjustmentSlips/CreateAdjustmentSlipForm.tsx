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
				type="number"
				id={`${index}.newFulfilledQuantityPiece`}
				isWholeNumber={
					values?.[index]?.unitOfMeasurement ===
					unitOfMeasurementTypes.NON_WEIGHING
				}
				disabled={!values?.[index]?.selected || values?.[index]?.approved}
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
			onSubmit={async (formData: any) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);
				onSubmit(formData);
			}}
			enableReinitialize
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
						scroll={{ x: 800 }}
						pagination={false}
						loading={loading}
					/>

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
							text="Create"
							variant="primary"
							loading={loading || isSubmitting}
							disabled={!preparationSlipProducts.length}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
