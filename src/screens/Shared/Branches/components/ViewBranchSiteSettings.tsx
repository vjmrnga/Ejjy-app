/* eslint-disable no-mixed-spaces-and-tabs */
import {
	Col,
	DatePicker,
	Divider,
	Input,
	message,
	Radio,
	Row,
	Spin,
	TimePicker,
	Button,
} from 'antd';
import { RequestErrors, TableHeader } from 'components';
import { FieldError, FormattedInputNumber, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { inputTypes, taxTypes } from 'global';
import { useSiteSettingsEdit, useSiteSettingsRetrieve } from 'hooks';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { convertIntoArray } from 'utils/function';
import * as Yup from 'yup';

const getValidTimeTest = (label) =>
	Yup.string()
		.required()
		.nullable()
		.test('is-valid-time', `${label} is not a valid time`, (value) =>
			moment(value).isValid(),
		)
		.label(label);

const getValidDateTest = (label) =>
	Yup.string()
		.required()
		.nullable()
		.test('is-valid-date', `${label} is not a valid time`, (value) =>
			moment(value).isValid(),
		)
		.label(label);

interface Props {
	branchId: any;
	withHeader?: boolean;
}

export const ViewBranchSiteSettings = ({
	branchId,
	withHeader = true,
}: Props) => {
	// CUSTOM HOOKS
	const {
		data: siteSettings,
		isFetching,
		error: retrieveError,
	} = useSiteSettingsRetrieve({
		params: {
			branchId,
		},
		options: {
			refetchOnMount: 'always',
		},
	});
	const {
		mutateAsync: editSiteSettings,
		isLoading,
		error: editError,
	} = useSiteSettingsEdit();

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchId,
				id: siteSettings?.id,
				closeSessionDeadline: siteSettings?.close_session_deadline
					? moment(siteSettings.close_session_deadline, 'hh:mm:ss')
					: null,
				closeDayDeadline: siteSettings?.close_day_deadline
					? moment(siteSettings.close_day_deadline, 'hh:mm:ss')
					: null,

				proprietor: siteSettings?.proprietor || '',
				taxType: siteSettings?.tax_type || null,
				tin: siteSettings?.tin || '',
				permitNumber: siteSettings?.permit_number || '',

				softwareDeveloper: siteSettings?.software_developer || '',
				softwareDeveloperTin: siteSettings?.software_developer_tin || '',

				posAccreditationNumber: siteSettings?.pos_accreditation_number || '',
				posAccreditationDate: siteSettings?.pos_accreditation_date
					? moment(siteSettings.pos_accreditation_date, 'YYYY-MM-DD')
					: null,
				posAccreditationValidUntilDate:
					siteSettings?.pos_accreditation_valid_until_date
						? moment(
								siteSettings.pos_accreditation_valid_until_date,
								'YYYY-MM-DD',
						  )
						: null,

				ptuNumber: siteSettings?.ptu_number || '',
				ptuDate: siteSettings?.ptu_date
					? moment(siteSettings.ptu_date, 'YYYY-MM-DD')
					: null,
				ptuValidUntilDate: siteSettings?.ptu_valid_until_date
					? moment(siteSettings.ptu_valid_until_date, 'YYYY-MM-DD')
					: null,

				productVersion: siteSettings?.product_version || '',
				thankYouMessage: siteSettings?.thank_you_message || '',

				reportingPeriodDayOfMonth: siteSettings?.reporting_period_day_of_month,

				resetCounterNotificationThresholdAmount:
					siteSettings?.reset_counter_notification_threshold_amount || '',
				resetCounterNotificationThresholdInvoiceNumber:
					siteSettings?.reset_counter_notification_threshold_invoice_number ||
					'',

				storeName: siteSettings?.store_name || '',
				addressOfTaxPayer: siteSettings?.address_of_tax_payer || '',
			},
			Schema: Yup.object().shape({
				closeSessionDeadline: getValidTimeTest('Close Session Deadline'),
				closeDayDeadline: getValidTimeTest('Close Day Deadline'),

				proprietor: Yup.string().required().label('Proprietor'),
				taxType: Yup.string().required().label('Tax Type'),
				tin: Yup.string().required().label('TIN'),
				permitNumber: Yup.string().required().label('Permit Number'),
				softwareDeveloper: Yup.string().required().label('Software Developer'),
				softwareDeveloperTin: Yup.string()
					.required()
					.label('Software Developer TIN'),

				posAccreditationNumber: Yup.string()
					.required()
					.label('POS Accreditation Number'),
				posAccreditationDate: getValidDateTest('POS Accreditation Date'),
				posAccreditationValidUntilDate: getValidDateTest(
					'POS Accreditation Valid Until Date',
				),

				ptuNumber: Yup.string().required().label('PTU Number'),
				ptuDate: getValidDateTest('PTU Date'),
				ptuValidUntilDate: getValidDateTest('PTU Valid Until Date'),

				productVersion: Yup.string().required().label('Product Version'),
				thankYouMessage: Yup.string().required().label('Thank You Message'),

				reportingPeriodDayOfMonth: Yup.number()
					.min(1)
					.max(28)
					.label('Reporting Day of the Month'),

				resetCounterNotificationThresholdAmount: Yup.number()
					.required()
					.min(0)
					.max(1_000_000_000)
					.label('Reset Counter Notification Threshold Amount'),
				resetCounterNotificationThresholdInvoiceNumber: Yup.number()
					.required()
					.min(0)
					.max(999_999)
					.label('Reset Counter Notification Threshold Invoice Number'),

				storeName: Yup.string().required().label('Store Name'),
				addressOfTaxPayer: Yup.string()
					.required()
					.label('Address of Tax Payer'),
			}),
		}),
		[siteSettings],
	);

	const renderDatePicker = ({ name, label, values, setFieldValue }) => (
		<>
			<Label id={name} label={label} spacing />
			<DatePicker
				format="YYYY-MM-DD"
				size="large"
				value={values[name]}
				onSelect={(value) => setFieldValue(name, value)}
				style={{ width: '100%' }}
				allowClear={false}
			/>
			<ErrorMessage
				name={name}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);

	const renderTimePicker = ({ name, label, values, setFieldValue }) => (
		<>
			<Label id={name} label={label} spacing />
			<TimePicker
				format="h:mm A"
				size="large"
				minuteStep={5}
				onSelect={(value) => setFieldValue(name, value)}
				value={values[name]}
				style={{ width: '100%' }}
				allowClear={false}
				hideDisabledOptions
				use12Hours
			/>
			<ErrorMessage
				name={name}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);

	const renderInputField = ({
		name,
		label,
		type = inputTypes.TEXT,
		values,
		setFieldValue,
	}) => (
		<>
			<Label id={name} label={label} spacing />
			{[inputTypes.TEXT, inputTypes.NUMBER].includes(type) && (
				<Input
					value={values[name]}
					type={type}
					onChange={(e) => {
						setFieldValue(name, e.target.value);
					}}
					size="large"
				/>
			)}
			{type === inputTypes.MONEY && (
				<FormattedInputNumber
					size="large"
					value={values[name]}
					controls={false}
					style={{ width: '100%' }}
					onChange={(value) => {
						setFieldValue(name, value);
					}}
				/>
			)}
			<ErrorMessage
				name={name}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);

	const onSubmit = async (formData) => {
		await editSiteSettings({
			...formData,
			closeSessionDeadline: formData.closeSessionDeadline.format('HH:mm:ss'),
			closeDayDeadline: formData.closeDayDeadline.format('HH:mm:ss'),
			posAccreditationDate: formData.posAccreditationDate.format('YYYY-MM-DD'),
			posAccreditationValidUntilDate:
				formData.posAccreditationValidUntilDate.format('YYYY-MM-DD'),
			ptuDate: formData.ptuDate.format('YYYY-MM-DD'),
			ptuValidUntilDate: formData.ptuValidUntilDate.format('YYYY-MM-DD'),
		});

		message.success('Site settings updated successfully');
	};

	return (
		<Spin size="large" spinning={isFetching}>
			{withHeader && <TableHeader title="Site Settings" />}

			<RequestErrors
				errors={[
					...convertIntoArray(retrieveError),
					...convertIntoArray(editError),
				]}
				withSpaceBottom
			/>

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
							<Divider>Store Details</Divider>

							<Col span={24} md={12}>
								{renderInputField({
									name: 'storeName',
									label: 'Store Name',
									setFieldValue,
									values,
								})}
							</Col>
							<Col span={24} md={12}>
								{renderInputField({
									name: 'addressOfTaxPayer',
									label: 'Address of Tax Payer',
									setFieldValue,
									values,
								})}
							</Col>

							<Divider>Receipt Header</Divider>

							<Col xs={24} sm={12}>
								{renderInputField({
									name: 'proprietor',
									label: 'Proprietor',
									setFieldValue,
									values,
								})}
							</Col>

							<Col xs={24} sm={6}>
								<Label label="VAT Type" spacing />
								<Radio.Group
									value={values.taxType}
									options={[
										{ label: 'VAT', value: taxTypes.VAT },
										{ label: 'NVAT', value: taxTypes.NVAT },
									]}
									onChange={(e) => {
										setFieldValue('taxType', e.target.value);
									}}
									optionType="button"
								/>
							</Col>

							<Col xs={24} sm={12}>
								{renderInputField({
									name: 'tin',
									label: 'TIN',
									setFieldValue,
									values,
								})}
							</Col>

							<Col xs={24} sm={12}>
								{renderInputField({
									name: 'permitNumber',
									label: 'Permit Number',
									setFieldValue,
									values,
								})}
							</Col>

							<Divider>Receipt Footer</Divider>

							<Col xs={24} sm={12}>
								{renderInputField({
									name: 'softwareDeveloper',
									label: 'Software Developer',
									setFieldValue,
									values,
								})}
							</Col>
							<Col xs={24} sm={12}>
								{renderInputField({
									name: 'softwareDeveloperTin',
									label: 'Software Developer TIN',
									setFieldValue,
									values,
								})}
							</Col>

							<Col xs={24} sm={8}>
								{renderInputField({
									name: 'posAccreditationNumber',
									label: 'POS Accreditation Number',
									setFieldValue,
									values,
								})}
							</Col>

							<Col xs={24} sm={8}>
								{renderDatePicker({
									name: 'posAccreditationDate',
									label: 'POS Accreditation Date',
									values,
									setFieldValue,
								})}
							</Col>

							<Col xs={24} sm={8}>
								{renderDatePicker({
									name: 'posAccreditationValidUntilDate',
									label: 'POS Accreditation Valid Until Date',
									values,
									setFieldValue,
								})}
							</Col>

							<Col xs={24} sm={8}>
								{renderInputField({
									name: 'ptuNumber',
									label: 'PTU Number',
									setFieldValue,
									values,
								})}
							</Col>
							<Col xs={24} sm={8}>
								{renderDatePicker({
									name: 'ptuDate',
									label: 'PTU Date',
									values,
									setFieldValue,
								})}
							</Col>

							<Col xs={24} sm={8}>
								{renderDatePicker({
									name: 'ptuValidUntilDate',
									label: 'PTU Valid Until Date',
									values,
									setFieldValue,
								})}
							</Col>

							<Divider>Cashiering Details</Divider>

							<Col xs={24} sm={12}>
								{renderTimePicker({
									name: 'closeSessionDeadline',
									label: 'Close Session Deadline',
									values,
									setFieldValue,
								})}
							</Col>

							<Col xs={24} sm={12}>
								{renderTimePicker({
									name: 'closeDayDeadline',
									label: 'Close Day Deadline',
									values,
									setFieldValue,
								})}
							</Col>

							<Col xs={24} sm={12}>
								{renderInputField({
									name: 'reportingPeriodDayOfMonth',
									label: 'Reporting Day of the Month',
									type: inputTypes.NUMBER,
									setFieldValue,
									values,
								})}
							</Col>

							<Col xs={24} sm={12}>
								{renderInputField({
									name: 'productVersion',
									label: 'Product Version',
									setFieldValue,
									values,
								})}
							</Col>

							<Col span={24}>
								{renderInputField({
									name: 'thankYouMessage',
									label: 'Thank You Message',
									setFieldValue,
									values,
								})}
							</Col>

							<Divider>Notification</Divider>

							<Col xs={24} sm={12}>
								{renderInputField({
									name: 'resetCounterNotificationThresholdAmount',
									label: 'Reset Counter Notification Threshold Amount',
									type: inputTypes.MONEY,
									setFieldValue,
									values,
								})}
							</Col>

							<Col xs={24} sm={12}>
								{renderInputField({
									name: 'resetCounterNotificationThresholdInvoiceNumber',
									label: 'Reset Counter Notification Threshold Invoice Number',
									type: inputTypes.NUMBER,
									setFieldValue,
									values,
								})}
							</Col>
						</Row>

						<Divider />

						<Button
							htmlType="submit"
							type="primary"
							size="large"
							loading={isLoading}
							block
						>
							Save
						</Button>
					</Form>
				)}
			</Formik>
		</Spin>
	);
};
