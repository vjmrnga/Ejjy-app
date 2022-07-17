/* eslint-disable react/no-this-in-sfc */
import { Col, Row } from 'antd';
import {
	Button,
	FieldError,
	FormInput,
	Label,
	UncontrolledInput,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { unitOfMeasurementTypes } from 'global';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import { sleep } from 'utils';
import * as Yup from 'yup';

interface Props {
	products: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const ReceiveDeliveryReceiptForm = ({
	products,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: products.map((product) => ({
				order_slip_product_id: product.order_slip_product_id,
				received_quantity_piece: product.received_quantity_piece,
				unit_of_measurement: product.unit_of_measurement,
			})),
			Schema: Yup.array().of(
				Yup.object().shape({
					received_quantity_piece: Yup.number()
						.min(0)
						.required()
						.test(
							'is-whole-number',
							'Non-weighing items require whole number quantity.',
							function test(value) {
								// NOTE: We need to use a no-named function so
								// we can use 'this' and access the other form field value.
								return this.parent.unit_of_measurement ===
									unitOfMeasurementTypes.NON_WEIGHING
									? isInteger(Number(value))
									: true;
							},
						)
						.label('Quantity'),
				}),
			),
		}),
		[products],
	);

	const getRow = (name, index) => (
		<Row gutter={[25, 8]}>
			<Col sm={12} xs={24}>
				<Label label="Product" spacing />
				<UncontrolledInput placeholder={name} disabled onChange={null} />
			</Col>

			<Col sm={12} xs={24}>
				<Label label="Quantity" spacing />
				<FormInput id={`${index}.received_quantity_piece`} type="number" />
				<ErrorMessage
					name={`${index}.received_quantity_piece`}
					render={(error) => <FieldError error={error} />}
				/>
			</Col>
		</Row>
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			enableReinitialize
			onSubmit={async (formData) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);
				onSubmit(formData);
			}}
		>
			<Form>
				<Row gutter={[0, 20]}>
					{products.map(({ name }, index) => (
						<Col key={name} span={24}>
							{getRow(name, index)}
						</Col>
					))}
				</Row>

				<div className="ModalCustomFooter">
					<Button
						disabled={loading || isSubmitting}
						text="Cancel"
						type="button"
						onClick={onClose}
					/>
					<Button
						disabled={!products.length}
						loading={loading || isSubmitting}
						text="Receive"
						type="submit"
						variant="primary"
					/>
				</div>
			</Form>
		</Formik>
	);
};
