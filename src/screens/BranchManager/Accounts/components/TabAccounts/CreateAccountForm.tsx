import { Col, DatePicker, Row } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInputLabel,
	FormRadioButton,
	Label,
} from '../../../../../components/elements';
import { sleep } from '../../../../../utils/function';

const formDetails = {
	defaultValues: {
		firstName: '',
		middleName: '',
		lastName: '',
		birthday: null,
		businessName: '',
		homeAddress: '',
		businessAddress: '',
		contactNumber: '',
		gender: '',
	},
	schema: Yup.object().shape(
		{
			firstName: Yup.string().required().label('First Name'),
			middleName: Yup.string().label('Middle Name'),
			lastName: Yup.string().required().label('Last Name'),
			birthday: Yup.date().nullable().required().label('Birthday'),
			businessName: Yup.string().required().label('Business Name'),
			homeAddress: Yup.string().required().label('Address (Home)'),
			businessAddress: Yup.string().required().label('Address (Business)'),
			contactNumber: Yup.string().required().label('Contact Number'),
			gender: Yup.string().required().label('Gender'),
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

				onSubmit({
					...formData,
					birthday: formData.birthday
						? formData.birthday.format('YYYY-MM-DD')
						: undefined,
				});
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[15, 15]}>
						<Col md={8}>
							<FormInputLabel id="firstName" label="First Name" />
							<ErrorMessage
								name="firstName"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col md={8}>
							<FormInputLabel id="middleName" label="Middle Name" />
							<ErrorMessage
								name="middleName"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col md={8}>
							<FormInputLabel id="lastName" label="Last Name" />
							<ErrorMessage
								name="lastName"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24} md={12}>
							<Label id="gender" label="Gender" spacing />
							<FormRadioButton
								id="gender"
								items={[
									{
										id: 'm',
										label: 'Male',
										value: 'm',
									},
									{
										id: 'f',
										label: 'Female',
										value: 'f',
									},
								]}
							/>
							<ErrorMessage
								name="gender"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24} md={12}>
							<Label id="birthday" label="Birthday" spacing />
							<DatePicker
								format="MMMM DD, YYYY"
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
							<FormInputLabel id="businessName" label="Business Name" />
							<ErrorMessage
								name="businessName"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={12}>
							<FormInputLabel id="homeAddress" label="Address (Home)" />
							<ErrorMessage
								name="homeAddress"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={12}>
							<FormInputLabel id="businessAddress" label="Address (Business)" />
							<ErrorMessage
								name="businessAddress"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<FormInputLabel id="contactNumber" label="Contact Number" />
							<ErrorMessage
								name="contactNumber"
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
