import { Divider } from 'antd';
import { Field, FieldArray, Form, Formik } from 'formik';
import { floor } from 'lodash';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { TableNormal } from '../../../../components';
import {
	Button,
	FieldError,
	FormCheckbox,
	FormInput,
	FormSelect,
} from '../../../../components/elements';
import { quantityTypeOptions, quantityTypes } from '../../../../global/variables';
import { sleep } from '../../../../utils/function';

const columns = [
	{ name: '', width: '80px' },
	{ name: 'Barcode' },
	{ name: 'Name' },
	{ name: 'Quantity', width: '200px' },
	{ name: "Preparing Branch's Balance" },
	{ name: 'Assigned Personnel' },
];

interface Props {
	branchProducts: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateEditOrderSlipForm = ({
	requestedProducts,
	branchesOptions,
	assignedPersonnelOptions,
	onSubmit,
	onClose,
	loading,
}) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branch_id: '',
				requestedProducts: requestedProducts.map((requestedProduct) => ({
					selected: true,
					quantity: '',
					quantity_type: quantityTypes.PIECE,
					product_id: requestedProduct?.product_id,
				})),
			},
			Schema: Yup.object().shape({
				requestedProducts: Yup.array().of(
					Yup.object().shape({
						selected: Yup.boolean(),
						quantity: Yup.number()
							.min(1, 'Must greater than zero')
							.when('selected', {
								is: true,
								then: Yup.number().required('Qty required'),
								otherwise: Yup.number().notRequired(),
							}),
					}),
				),
			}),
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const getExtraFields = (index) => (
		<Field type="hidden" name={`requestedProducts.${index}.product_id`} />
	);

	const getSelectRadioButton = (index) => {
		return <FormCheckbox id={`requestedProducts.${index}.selected`} />;
	};

	const getQuantity = (index, values, touched, errors) => {
		return (
			<>
				<div className="quantity-container">
					<FormInput
						type="number"
						id={`requestedProducts.${index}.quantity`}
						min={1}
						disabled={!values?.requestedProducts?.[index]?.selected}
					/>
					<FormSelect
						id={`requestedProducts.${index}.quantity_type`}
						options={quantityTypeOptions}
						disabled={!values?.requestedProducts?.[index]?.selected}
					/>
				</div>
				{errors?.requestedProducts?.[index]?.quantity &&
				touched?.requestedProducts?.[index]?.quantity ? (
					<FieldError error={errors?.requestedProducts?.[index]?.quantity} />
				) : null}
			</>
		);
	};

	const getCurrentBalance = (index, current_balance, pieces_in_bulk, values) => {
		return values?.requestedProducts?.[index]?.quantity_type === quantityTypes.PIECE ? (
			<span>{current_balance}</span>
		) : (
			<span>{floor(current_balance / pieces_in_bulk)}</span>
		);
	};

	const getAssignedPersonnel = (index, values) => {
		return (
			<FormSelect
				id={`requestedProducts.${index}.assigned_personnel`}
				options={assignedPersonnelOptions}
				disabled={!values?.requestedProducts?.[index]?.selected}
			/>
		);
	};

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (values: any) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);
				onSubmit(values);
			}}
			enableReinitialize
		>
			{({ values, errors, touched }) => (
				<FieldArray
					name="requestedProducts"
					render={() => (
						<Form className="form">
							<FormSelect id={`assigned_branch_id`} options={branchesOptions} />

							<TableNormal
								columns={columns}
								data={requestedProducts.map((requestedProduct, index) => [
									// Select
									<>
										{getSelectRadioButton(index)}
										{getExtraFields(index)}
									</>,
									// Barcode
									requestedProduct?.product?.id,
									// Name
									requestedProduct?.product?.name,
									// Quantity / Bulk | Pieces
									getQuantity(index, values, touched, errors),
									// Current Balance
									getCurrentBalance(
										index,
										requestedProduct?.current_balance,
										requestedProduct?.product?.pieces_in_bulk,
										values,
									),
									// Assigned Personnel
									getAssignedPersonnel(index, values),
								])}
							/>

							<Divider dashed />

							<div className="custom-footer">
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
								/>
							</div>
						</Form>
					)}
				/>
			)}
		</Formik>
	);
};
