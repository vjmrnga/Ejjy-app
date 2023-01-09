/* eslint-disable no-confusing-arrow */
import { Col, Divider, Row } from 'antd';
import { Button, FieldError, FormInputLabel } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { unitOfMeasurementTypes } from 'global';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import { sleep } from 'utils';
import * as Yup from 'yup';

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
			enableReinitialize
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
		>
			<Form>
				<Row>
					<Col span={24}>
						<FormInputLabel
							id="max_balance"
							label="Max Balance"
							type="number"
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
									id="current_balance"
									isWholeNumber={
										branchProduct?.product?.unit_of_measurement ===
										unitOfMeasurementTypes.NON_WEIGHING
									}
									label="Current Balance"
									type="number"
								/>
								<ErrorMessage
									name="current_balance"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
						</>
					)}
				</Row>

				<div className="ModalCustomFooter">
					<Button
						disabled={loading || isSubmitting}
						text="Cancel"
						type="button"
						onClick={onClose}
					/>
					<Button
						loading={loading || isSubmitting}
						text="Edit"
						type="submit"
						variant="primary"
					/>
				</div>
			</Form>
		</Formik>
	);
};
