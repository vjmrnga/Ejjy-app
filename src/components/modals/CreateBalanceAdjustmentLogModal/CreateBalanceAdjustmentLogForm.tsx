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
			enableReinitialize
			onSubmit={async (formData) => {
				onSubmit(formData);
			}}
		>
			<Form>
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<FormInputLabel id="newBalance" label="New Balance" type="number" />
						<ErrorMessage
							name="newBalance"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
				</Row>

				<div className="ModalCustomFooter">
					<Button
						disabled={loading}
						text="Cancel"
						type="button"
						onClick={onClose}
					/>
					<Button
						loading={loading}
						text="Create"
						type="submit"
						variant="primary"
					/>
				</div>
			</Form>
		</Formik>
	);
};
