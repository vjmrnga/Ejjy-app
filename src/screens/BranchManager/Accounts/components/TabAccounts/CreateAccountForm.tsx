import { Col, DatePicker, Divider, Row, Select } from 'antd';
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
import { accountTypes } from '../../../../../global/types';
import { sleep } from '../../../../../utils/function';

const formDetails = {
	defaultValues: {
		type: accountTypes.PERSONAL,
		firstName: '',
		middleName: undefined,
		lastName: '',
		birthday: null,
		tin: '',
		businessName: undefined,
		homeAddress: '',
		businessAddress: undefined,
		contactNumber: '',
		gender: '',
	},
	schema: Yup.object().shape(
		{
			type: Yup.string().required().label('Type'),
			firstName: Yup.string().required().label('First Name'),
			middleName: Yup.string().nullable().label('Middle Name'),
			lastName: Yup.string().required().label('Last Name'),
			birthday: Yup.date().nullable().required().label('Birthday'),
			tin: Yup.string().required().label('TIN'),
			businessName: Yup.string()
				.nullable()
				.when('type', {
					is: (type) =>
						[accountTypes.CORPORATE, accountTypes.GOVERNMENT].includes(type),
					then: Yup.string().required().label('Business Name'),
				}),
			homeAddress: Yup.string().required().label('Address (Home)'),
			businessAddress: Yup.string()
				.nullable()
				.when('type', {
					is: (type) =>
						[accountTypes.CORPORATE, accountTypes.GOVERNMENT].includes(type),
					then: Yup.string().required().label('Address (Business)'),
				}),
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
					middleName: formData.middleName || undefined,
					businessName: formData.businessName || undefined,
					businessAddress: formData.businessAddress || undefined,
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
						<Col span={24}>
							<Label id="type" label="Type" spacing />
							<Select
								style={{ width: '100%' }}
								value={values.type}
								onChange={(value) => {
									setFieldValue('type', value);

									const employees = [
										accountTypes.PERSONAL,
										accountTypes.EMPLOYEE,
									];
									if (employees.includes(value)) {
										setFieldValue('businessName', undefined);
										setFieldValue('businessAddress', undefined);
									}
								}}
								optionFilterProp="children"
								filterOption={(input, option) =>
									option.children
										.toString()
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								showSearch
							>
								<Select.Option
									key={accountTypes.PERSONAL}
									value={accountTypes.PERSONAL}
								>
									Personal
								</Select.Option>
								<Select.Option
									key={accountTypes.CORPORATE}
									value={accountTypes.CORPORATE}
								>
									Corporate
								</Select.Option>
								<Select.Option
									key={accountTypes.EMPLOYEE}
									value={accountTypes.EMPLOYEE}
								>
									Employee
								</Select.Option>
								<Select.Option
									key={accountTypes.GOVERNMENT}
									value={accountTypes.GOVERNMENT}
								>
									Government
								</Select.Option>
							</Select>

							<ErrorMessage
								name="type"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Divider />

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
							<FormInputLabel id="tin" label="TIN" />
							<ErrorMessage
								name="tin"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						{[accountTypes.CORPORATE, accountTypes.GOVERNMENT].includes(
							values.type,
						) && (
							<>
								<Col span={24} md={12}>
									<FormInputLabel
										id="businessName"
										label={
											values.type == accountTypes.CORPORATE
												? 'Business Name'
												: 'Agency Name'
										}
									/>
									<ErrorMessage
										name="businessName"
										render={(error) => <FieldError error={error} />}
									/>
								</Col>
								<Col span={24} md={12}>
									<FormInputLabel
										id="businessAddress"
										label={
											values.type == accountTypes.CORPORATE
												? 'Address (Business)'
												: 'Address (Agency)'
										}
									/>
									<ErrorMessage
										name="businessAddress"
										render={(error) => <FieldError error={error} />}
									/>
								</Col>
							</>
						)}

						<Col span={24}>
							<FormInputLabel id="homeAddress" label="Address (Home)" />
							<ErrorMessage
								name="homeAddress"
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
