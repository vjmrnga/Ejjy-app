import { Col, DatePicker, Row, Select, Spin } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import moment from 'moment';
import React, { useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInputLabel,
	Label,
} from '../../../../../components/elements';
import { request } from '../../../../../global/types';
import { sleep } from '../../../../../utils/function';

const formDetails = {
	defaultValues: {
		account_id: '',
		credit_limit: '',
		date_of_registration: moment(),
	},
	schema: Yup.object().shape(
		{
			account_id: Yup.number().required().label('Account'),
			credit_limit: Yup.number().required().label('Credit Limit'),
			date_of_registration: Yup.date().required().label('Date of Registration'),
		},
		[],
	),
};

interface Props {
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const CreateCreditRegistrationForm = ({
	loading,
	onSubmit,
	onClose,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);
	const [productOptions, setProductOptions] = useState([]);

	// useEffect(() => {
	// 	setProductOptions(
	// 		products.map((product) => ({
	// 			label: product.name,
	// 			value: product.id,
	// 		})),
	// 	);

	// 	if (!isDefaultProductFetched) {
	// 		const productIds = toString(params.productIds)
	// 			.split(',')
	// 			.map((x) => Number(x));
	// 		const options = products
	// 			.filter((product) => productIds.includes(product.id))
	// 			.map((product) => ({
	// 				label: product.name,
	// 				value: product.id,
	// 			}));

	// 		setSelectedProducts(options);

	// 		// Only set default product fetched true if exact same length;
	// 		if (options.length === productIds.length) {
	// 			setIsDefaultProductFetched(true);
	// 		}
	// 	}
	// }, [products]);

	return (
		<Formik
			initialValues={formDetails.defaultValues}
			validationSchema={formDetails.schema}
			onSubmit={async (formData) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(formData);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[15, 15]}>
						<Col span={24}>
							<Label label="Account" spacing />
							<Select
								style={{ width: '100%' }}
								filterOption={false}
								onSearch={() => {
									// TODO: Search for account
								}}
								// notFoundContent={
								// 	status === request.REQUESTING ? <Spin size="small" /> : null
								// }
								options={productOptions}
								value={values.account_id}
								onChange={(value) => {
									setFieldValue('account_id', value);
								}}
								labelInValue
							/>

							<ErrorMessage
								name="account_id"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<FormInputLabel id="credit_limit" label="Credit Limit" />
							<ErrorMessage
								name="credit_limit"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label
								id="date_of_registration"
								label="Date of Registration"
								spacing
							/>
							<DatePicker
								format="YYYY-MM-DD"
								size="large"
								value={values.date_of_registration}
								onSelect={(value) =>
									setFieldValue('date_of_registration', value)
								}
								style={{ width: '100%' }}
								allowClear={false}
							/>
							<ErrorMessage
								name="date_of_registration"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

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
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
