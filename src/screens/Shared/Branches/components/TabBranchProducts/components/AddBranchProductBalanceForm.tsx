/* eslint-disable no-confusing-arrow */
import { Col, Row } from 'antd';
import { Button, FieldError, FormInputLabel } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { unitOfMeasurementTypes } from 'global';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import { sleep } from 'utils';
import * as Yup from 'yup';

interface Props {
	branchProduct?: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const AddBranchProductBalanceForm = ({
	branchProduct,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				balance: '',
			},
			Schema: Yup.object().shape({
				// eslint-disable-next-line newline-per-chained-call
				balance: Yup.number()
					.required()
					.moreThan(0)
					.test(
						'is-whole-number',
						'Non-weighing items require whole number quantity.',
						(value) =>
							branchProduct.product.unit_of_measurement ===
							unitOfMeasurementTypes.NON_WEIGHING
								? isInteger(Number(value))
								: true,
					)
					.label('Quantity'),
			}),
		}),
		[branchProduct],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			enableReinitialize
			onSubmit={async (values) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(values);
			}}
		>
			<Form>
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<FormInputLabel
							id="balance"
							isWholeNumber={
								branchProduct.product.unit_of_measurement ===
								unitOfMeasurementTypes.NON_WEIGHING
							}
							label="Qty Delivered"
							type="number"
						/>
						<ErrorMessage
							name="balance"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
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
						text="Add"
						type="submit"
						variant="primary"
					/>
				</div>
			</Form>
		</Formik>
	);
};
