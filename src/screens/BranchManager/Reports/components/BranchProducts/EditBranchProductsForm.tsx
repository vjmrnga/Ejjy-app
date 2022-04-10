/* eslint-disable no-confusing-arrow */
import { Col, Divider } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { DetailsRow } from '../../../../../components';
import {
	Button,
	FieldError,
	FormInputLabel,
} from '../../../../../components/elements';
import { unitOfMeasurementTypes } from '../../../../../global/types';
import { sleep } from '../../../../../utils/function';

interface Props {
	branchProduct: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
	isCurrentBalanceVisible: boolean;
}

export const EditBranchProductsForm = ({
	branchProduct,
	onSubmit,
	onClose,
	loading,
	isCurrentBalanceVisible,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: branchProduct?.id,
				max_balance: branchProduct?.max_balance,
				current_balance: branchProduct?.current_balance,
				is_daily_checked: branchProduct?.is_daily_checked,
				is_randomly_checked: branchProduct?.is_randomly_checked,
				is_sold_in_branch: branchProduct?.is_sold_in_branch,
			},
			Schema: Yup.object().shape({
				max_balance: Yup.number()
					.required()
					.moreThan(0)
					.test(
						'is-whole-number',
						'Non-weighing items require whole number quantity.',
						(value) =>
							branchProduct?.product?.unit_of_measurement ===
							unitOfMeasurementTypes.NON_WEIGHING
								? isInteger(Number(value))
								: true,
					)
					.label('Max Balance'),
				current_balance: isCurrentBalanceVisible
					? Yup.number()
							.required()
							.min(0)
							.test(
								'is-whole-number',
								'Non-weighing items require whole number quantity.',
								(value) =>
									branchProduct?.product?.unit_of_measurement ===
									unitOfMeasurementTypes.NON_WEIGHING
										? isInteger(Number(value))
										: true,
							)
							.label('Current Balance')
					: undefined,
			}),
		}),
		[branchProduct, isCurrentBalanceVisible],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(
					{
						...formData,

						// NOTE: Hidden fields must be visible in order to be saved.
						current_balance: isCurrentBalanceVisible
							? formData.current_balance
							: undefined,
					},
					resetForm,
				);
			}}
			enableReinitialize
		>
			<Form className="form">
				<DetailsRow>
					<Col span={24}>
						<FormInputLabel
							type="number"
							id="max_balance"
							label="Max Balance"
						/>
						<ErrorMessage
							name="max_balance"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					{isCurrentBalanceVisible && (
						<>
							<Divider dashed>HIDDEN FIELDS</Divider>

							<Col span={24}>
								<FormInputLabel
									type="number"
									id="current_balance"
									label="Current Balance"
									isWholeNumber={
										branchProduct?.product?.unit_of_measurement ===
										unitOfMeasurementTypes.NON_WEIGHING
									}
								/>
								<ErrorMessage
									name="current_balance"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
						</>
					)}
				</DetailsRow>

				<div className="ModalCustomFooter">
					<Button
						type="button"
						text="Cancel"
						onClick={onClose}
						disabled={loading || isSubmitting}
					/>
					<Button
						type="submit"
						text="Edit"
						variant="primary"
						loading={loading || isSubmitting}
					/>
				</div>
			</Form>
		</Formik>
	);
};
