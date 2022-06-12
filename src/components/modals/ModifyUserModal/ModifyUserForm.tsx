import { Col, Divider, Input, Row, Select } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { userTypeBranchOptions, userTypeOptions, userTypes } from 'global';
import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, Label } from '../../elements';

interface Props {
	user?: any;
	branchUsersOnly?: boolean;
	isLoading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyUserForm = ({
	user,
	branchUsersOnly,
	isLoading,
	onSubmit,
	onClose,
}: Props) => {
	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: user?.id || null,
				firstName: user?.first_name || '',
				lastName: user?.last_name || '',
				email: user?.email || '',

				// NOTE: For create user only
				userType: user.user_type || '',
				username: '',
				password: '',
				confirmPassword: '',
			},
			Schema: Yup.object().shape({
				firstName: Yup.string().required().label('First Name'),
				lastName: Yup.string().required().label('Last Name'),
				email: Yup.string().email().required().email().label('Email'),
				username: user ? undefined : Yup.string().required().label('Username'),
				userType: user ? undefined : Yup.string().required().label('User Type'),
				password: user ? undefined : Yup.string().required().label('Password'),
				confirmPassword: user
					? undefined
					: Yup.string()
							.required()
							.oneOf([Yup.ref('password'), null], 'Passwords must match')
							.label('Confirm Password'),
			}),
		}),
		[],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="First Name" spacing />
							<Input
								name="firstName"
								value={values['firstName']}
								size="large"
								onChange={(e) => {
									setFieldValue('firstName', e.target.value);
								}}
							/>
							<ErrorMessage
								name="firstName"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Last Name" spacing />
							<Input
								name="lastName"
								value={values['lastName']}
								size="large"
								onChange={(e) => {
									setFieldValue('lastName', e.target.value);
								}}
							/>
							<ErrorMessage
								name="lastName"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Email Address" spacing />
							<Input
								type="email"
								name="email"
								value={values['email']}
								size="large"
								onChange={(e) => {
									setFieldValue('email', e.target.value);
								}}
							/>
							<ErrorMessage
								name="email"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="User Type" spacing />
							<Select
								className="w-100"
								filterOption={(input, option) =>
									option.children
										.toString()
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								optionFilterProp="children"
								value={values.userType}
								size="large"
								allowClear={false}
								showSearch
								onChange={(value) => {
									setFieldValue('userType', value);
								}}
							>
								{(branchUsersOnly
									? userTypeBranchOptions
									: userTypeOptions
								).map((userType) => (
									<Select.Option key={userType.value} value={userType.value}>
										{userType.name}
									</Select.Option>
								))}
							</Select>
							<ErrorMessage
								name="userType"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						{!user && (
							<>
								<Divider />

								<Col span={24}>
									<Label label="Username" spacing />
									<Input
										name="username"
										value={values['username']}
										size="large"
										onChange={(e) => {
											setFieldValue('username', e.target.value);
										}}
									/>
									<ErrorMessage
										name="username"
										render={(error) => <FieldError error={error} />}
									/>
								</Col>

								<Col sm={12} xs={24}>
									<Label label="Password" spacing />
									<Input.Password
										name="password"
										value={values['password']}
										size="large"
										onChange={(e) => {
											setFieldValue('password', e.target.value);
										}}
									/>
									<ErrorMessage
										name="password"
										render={(error) => <FieldError error={error} />}
									/>
								</Col>

								<Col sm={12} xs={24}>
									<Label label="Confirm Password" spacing />
									<Input.Password
										name="confirmPassword"
										value={values['confirmPassword']}
										size="large"
										onChange={(e) => {
											setFieldValue('confirmPassword', e.target.value);
										}}
									/>
									<ErrorMessage
										name="confirmPassword"
										render={(error) => <FieldError error={error} />}
									/>
								</Col>
							</>
						)}
					</Row>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={isLoading}
						/>
						<Button
							type="submit"
							text={user ? 'Edit' : 'Create'}
							variant="primary"
							loading={isLoading}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
