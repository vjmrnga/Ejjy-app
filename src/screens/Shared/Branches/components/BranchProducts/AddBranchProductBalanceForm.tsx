/* eslint-disable no-confusing-arrow */
import { Col, Row } from 'antd';
import { Form, Formik, ErrorMessage } from 'formik';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInputLabel,
} from '../../../../../components/elements';
import { sleep } from '../../../../../utils/function';
import { unitOfMeasurementTypes } from '../../../../../global/types';

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
			onSubmit={async (values) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(values);
			}}
			enableReinitialize
		>
			<Form>
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<FormInputLabel
							type="number"
							id="balance"
							label="Qty Delivered"
							isWholeNumber={
								branchProduct.product.unit_of_measurement ===
								unitOfMeasurementTypes.NON_WEIGHING
							}
						/>
						<ErrorMessage
							name="balance"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
				</Row>

				<div className="ModalCustomFooter">
					<Button
						type="button"
						text="Cancel"
						onClick={onClose}
						disabled={loading || isSubmitting}
					/>
					<Button
						type="submit"
						text="Add"
						variant="primary"
						loading={loading || isSubmitting}
					/>
				</div>
			</Form>
		</Formik>
	);
};
