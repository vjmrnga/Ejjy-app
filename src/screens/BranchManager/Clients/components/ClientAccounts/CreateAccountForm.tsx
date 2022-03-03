import { Col, DatePicker, Row } from 'antd';
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
import { sleep } from '../../../../../utils/function';

const formDetails = {
	defaultValues: {
		first_name: '',
		middle_name: '',
		last_name: '',
		birthday: null,
		business_name: '',
		address_home: '',
		address_business: '',
		contact_number: '',
		date_of_registration: moment(),
	},
	schema: Yup.object().shape(
		{
			first_name: Yup.string().required().label('First Name'),
			middle_name: Yup.string().required().label('Middle Name'),
			last_name: Yup.string().required().label('Last Name'),
			birthday: Yup.date().nullable().required().label('Birthday'),
			business_name: Yup.string().required().label('Business Name'),
			address_home: Yup.string().required().label('Address (Home)'),
			address_business: Yup.string().required().label('Address (Business)'),
			contact_number: Yup.string().required().label('Contact Number'),
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

export const CreateAccountForm = ({ loading, onSubmit, onClose }: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

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
						<Col md={8}>
							<FormInputLabel id="first_name" label="First Name" />
							<ErrorMessage
								name="first_name"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col md={8}>
							<FormInputLabel id="middle_name" label="Middle Name" />
							<ErrorMessage
								name="middle_name"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col md={8}>
							<FormInputLabel id="last_name" label="Last Name" />
							<ErrorMessage
								name="last_name"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label id="birthday" label="Birthday" spacing />
							<DatePicker
								format="YYYY-MM-DD"
								size="large"
								value={values.birthday}
								onSelect={(value) => setFieldValue('birthday', value)}
								style={{ width: '100%' }}
								allowClear={false}
							/>
							<ErrorMessage
								name="birthday"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<FormInputLabel id="business_name" label="Business Name" />
							<ErrorMessage
								name="business_name"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={12}>
							<FormInputLabel id="address_home" label="Address (Home)" />
							<ErrorMessage
								name="address_home"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={12}>
							<FormInputLabel
								id="address_business"
								label="Address (Business)"
							/>
							<ErrorMessage
								name="address_business"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<FormInputLabel id="contact_number" label="Contact Number" />
							<ErrorMessage
								name="contact_number"
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
