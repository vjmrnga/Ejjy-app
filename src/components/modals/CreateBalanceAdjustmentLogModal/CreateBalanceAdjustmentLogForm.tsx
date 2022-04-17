/* eslint-disable no-confusing-arrow */
import { Col, Row } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { unitOfMeasurementTypes } from 'global';
import { isInteger } from 'lodash';
import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel } from '../../elements';

interface Props {
	branchProduct: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateBalanceAdjustmentLogForm = ({
	branchProduct,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				newBalance: '',
			},
			Schema: Yup.object().shape({
				newBalance: Yup.number()
					.required()
					.min(0)
					.test(
						'is-whole-number',
						'Non-weighing items require whole number quantity.',
						(value) =>
							branchProduct.product.unit_of_measurement ===
							unitOfMeasurementTypes.NON_WEIGHING
								? isInteger(Number(value))
								: true,
					)
					.label('New Balance'),
			}),
		}),
		[branchProduct],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData) => {
				onSubmit(formData);
			}}
			enableReinitialize
		>
			<Form>
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<FormInputLabel type="number" id="newBalance" label="New Balance" />
						<ErrorMessage
							name="newBalance"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
				</Row>

				<div className="ModalCustomFooter">
					<Button
						type="button"
						text="Cancel"
						onClick={onClose}
						disabled={loading}
					/>
					<Button
						type="submit"
						text="Create"
						variant="primary"
						loading={loading}
					/>
				</div>
			</Form>
		</Formik>
	);
};
