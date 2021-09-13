import { Table } from 'antd/';
import { ColumnsType } from 'antd/lib/table';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormCheckbox,
	FormInput,
} from '../../../../../components/elements';
import { sleep } from '../../../../../utils/function';

const columns: ColumnsType = [
	{ title: '', dataIndex: 'selected', width: 50 },
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
				id: item.id,
				code: item.code,
				name: item.name,
				new_fulfilled_quantity_piece: null,
			})),
			Schema: Yup.array().of(
				Yup.object().shape({
					new_fulfilled_quantity_piece: Yup.number()
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
		[preparationSlipProducts],
	);

	const getQuantity = (index, values) => (
		<>
			<FormInput
				type="number"
				id={`${index}.new_fulfilled_quantity_piece`}
				disabled={!values?.[index]?.selected}
			/>
			<ErrorMessage
				name={`${index}.new_fulfilled_quantity_piece`}
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
						rowKey="key"
						columns={columns}
						dataSource={preparationSlipProducts.map((item, index) => ({
							key: item.id,
							selected: <FormCheckbox id={`${index}.selected`} />,
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
