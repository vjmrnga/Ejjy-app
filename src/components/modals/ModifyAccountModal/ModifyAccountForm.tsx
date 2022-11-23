import { Col, DatePicker, Divider, Input, Radio, Row, Select } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { accountTypes } from 'global';
import moment from 'moment';
import React, { useCallback } from 'react';
import { filterOption } from 'utils';
import * as Yup from 'yup';
import { Button, FieldError, Label } from '../../elements';

interface Props {
	account?: any;
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyAccountForm = ({
	account,
	loading,
	onSubmit,
	onClose,
}: Props) => {
	// METHODS
	const getFormDetails = useCallback(
		() => ({
			defaultValues: {
				type: account?.type || accountTypes.PERSONAL,
				firstName: account?.first_name || '',
				middleName: account?.middle_name || undefined,
				lastName: account?.last_name || '',
				birthday: account?.birthday ? moment(account?.birthday) : null,
				tin: account?.tin || '',
				businessName: account?.business_name || undefined,
				homeAddress: account?.home_address || '',
				businessAddress: account?.business_address || undefined,
				contactNumber: account?.contact_number || '',
				gender: account?.gender || '',
				isPointSystemEligible: account?.is_point_system_eligible || false,
			},
			schema: Yup.object().shape({
				type: Yup.string().required().label('Type'),
				firstName: Yup.string().trim().required().label('First Name'),
				middleName: Yup.string().nullable().label('Middle Name'),
				lastName: Yup.string().trim().required().label('Last Name'),
				birthday: Yup.date().nullable().required().label('Birthday'),
				tin: Yup.string().trim().required().label('TIN'),
				businessName: Yup.string()
					.nullable()
					.when('type', {
						is: (type) =>
							[accountTypes.CORPORATE, accountTypes.GOVERNMENT].includes(type),
						then: Yup.string().trim().required().label('Business Name'),
					}),
				homeAddress: Yup.string().trim().required().label('Address (Home)'),
				businessAddress: Yup.string()
					.nullable()
					.when('type', {
						is: (type) =>
							[accountTypes.CORPORATE, accountTypes.GOVERNMENT].includes(type),
						then: Yup.string().trim().required().label('Address (Business)'),
					}),
				contactNumber: Yup.string().trim().required().label('Contact Number'),
				gender: Yup.string().required().label('Gender'),
				isPointSystemEligible: Yup.boolean()
					.required()
					.label('Loyalty Membership'),
			}),
		}),
		[account],
	);

	return (
		<Formik
			initialValues={getFormDetails().defaultValues}
			validationSchema={getFormDetails().schema}
			enableReinitialize
			onSubmit={(formData) => {
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
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label id="type" label="Type" spacing />
							<Select
								className="w-100"
								disabled={account !== null}
								filterOption={filterOption}
								optionFilterProp="children"
								value={values.type}
								showSearch
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
							<Label label="First Name" spacing />
							<Input
								value={values.firstName}
								onChange={(e) => {
									setFieldValue('firstName', e.target.value);
								}}
							/>
							<ErrorMessage
								name="firstName"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col md={8}>
							<Label label="Middle Name" spacing />
							<Input
								value={values.middleName}
								onChange={(e) => {
									setFieldValue('middleName', e.target.value);
								}}
							/>
							<ErrorMessage
								name="middleName"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col md={8}>
							<Label label="Last Name" spacing />
							<Input
								value={values.lastName}
								onChange={(e) => {
									setFieldValue('lastName', e.target.value);
								}}
							/>
							<ErrorMessage
								name="lastName"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col md={12} span={24}>
							<Label label="Gender" spacing />
							<Radio.Group
								options={[
									{ label: 'Male', value: 'm' },
									{ label: 'Female', value: 'f' },
								]}
								optionType="button"
								value={values.gender}
								onChange={(e) => {
									setFieldValue('gender', e.target.value);
								}}
							/>
							<ErrorMessage
								name="gender"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col md={12} span={24}>
							<Label id="birthday" label="Birthday" spacing />
							<DatePicker
								allowClear={false}
								className="w-100"
								format="MMMM DD, YYYY"
								value={values.birthday}
								onSelect={(value) => setFieldValue('birthday', value)}
							/>
							<ErrorMessage
								name="birthday"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="TIN" spacing />
							<Input
								value={values.tin}
								onChange={(e) => {
									setFieldValue('tin', e.target.value);
								}}
							/>
							<ErrorMessage
								name="tin"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						{[accountTypes.CORPORATE, accountTypes.GOVERNMENT].includes(
							values.type,
						) && (
							<>
								<Col md={12} span={24}>
									<Label
										label={
											values.type === accountTypes.CORPORATE
												? 'Business Name'
												: 'Agency Name'
										}
										spacing
									/>
									<Input
										value={values.businessName}
										onChange={(e) => {
											setFieldValue('businessName', e.target.value);
										}}
									/>
									<ErrorMessage
										name="businessName"
										render={(error) => <FieldError error={error} />}
									/>
								</Col>
								<Col md={12} span={24}>
									<Label
										label={
											values.type === accountTypes.CORPORATE
												? 'Address (Business)'
												: 'Address (Agency)'
										}
										spacing
									/>
									<Input
										value={values.businessAddress}
										onChange={(e) => {
											setFieldValue('businessAddress', e.target.value);
										}}
									/>
									<ErrorMessage
										name="businessAddress"
										render={(error) => <FieldError error={error} />}
									/>
								</Col>
							</>
						)}

						<Col span={24}>
							<Label label="Address (Home)" spacing />
							<Input
								value={values.homeAddress}
								onChange={(e) => {
									setFieldValue('homeAddress', e.target.value);
								}}
							/>
							<ErrorMessage
								name="homeAddress"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Contact Number" spacing />
							<Input
								value={values.contactNumber}
								onChange={(e) => {
									setFieldValue('contactNumber', e.target.value);
								}}
							/>
							<ErrorMessage
								name="contactNumber"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Loyalty Membership" spacing />
							<Radio.Group
								options={[
									{ label: 'Yes', value: true },
									{ label: 'No', value: false },
								]}
								optionType="button"
								value={values.isPointSystemEligible}
								onChange={(e) => {
									setFieldValue('isPointSystemEligible', e.target.value);
								}}
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
							text={account ? 'Edit' : 'Create'}
							type="submit"
							variant="primary"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
