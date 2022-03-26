/* eslint-disable no-mixed-spaces-and-tabs */
import {
	Col,
	DatePicker,
	Divider,
	message,
	Radio,
	Row,
	Spin,
	TimePicker,
} from 'antd';
import { RequestErrors, TableHeader } from 'components';
import { Button, FieldError, FormInputLabel, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { taxTypes } from 'global';
import { useSiteSettingsEdit, useSiteSettingsRetrieve } from 'hooks';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { convertIntoArray, sleep } from 'utils/function';
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
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

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

	const renderDatePicker = (name, label, values, setFieldValue) => (
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

	const renderTimePicker = (name, label, values, setFieldValue) => (
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

	const renderInputField = (name, label, type = 'text') => (
		<>
			<FormInputLabel id={name} label={label} type={type} />
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

		message.success('Successfully updated site settings.');
	};

	return (
		<Spin size="large" spinning={isFetching || isLoading || isSubmitting}>
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
							<Col xs={24} sm={12}>
								{renderTimePicker(
									'closeSessionDeadline',
									'Close Session Deadline',
									values,
									setFieldValue,
								)}
							</Col>
							<Col xs={24} sm={12}>
								{renderTimePicker(
									'closeDayDeadline',
									'Close Day Deadline',
									values,
									setFieldValue,
								)}
							</Col>

							<Col xs={24} sm={12}>
								{renderInputField('proprietor', 'Proprietor')}
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
							<Col xs={24} sm={6}>
								{renderInputField(
									'reportingPeriodDayOfMonth',
									'Reporting Day of the Month',
									'number',
								)}
							</Col>
							<Col xs={24} sm={12}>
								{renderInputField('tin', 'TIN')}
							</Col>

							<Col xs={24} sm={12}>
								{renderInputField('permitNumber', 'Permit Number')}
							</Col>
							<Col xs={24} sm={12}>
								{renderInputField('softwareDeveloper', 'Software Developer')}
							</Col>
							<Col xs={24} sm={12}>
								{renderInputField(
									'softwareDeveloperTin',
									'Software Developer TIN',
								)}
							</Col>

							<Col xs={24} sm={8}>
								{renderInputField(
									'posAccreditationNumber',
									'POS Accreditation Number',
								)}
							</Col>
							<Col xs={24} sm={8}>
								{renderDatePicker(
									'posAccreditationDate',
									'POS Accreditation Date',
									values,
									setFieldValue,
								)}
							</Col>

							<Col xs={24} sm={8}>
								{renderDatePicker(
									'posAccreditationValidUntilDate',
									'POS Accreditation Valid Until Date',
									values,
									setFieldValue,
								)}
							</Col>

							<Col xs={24} sm={8}>
								{renderInputField('ptuNumber', 'PTU Number')}
							</Col>
							<Col xs={24} sm={8}>
								{renderDatePicker('ptuDate', 'PTU Date', values, setFieldValue)}
							</Col>

							<Col xs={24} sm={8}>
								{renderDatePicker(
									'ptuValidUntilDate',
									'PTU Valid Until Date',
									values,
									setFieldValue,
								)}
							</Col>

							<Col span={24}>
								{renderInputField('productVersion', 'Product Version')}
							</Col>

							<Col span={24}>
								{renderInputField('thankYouMessage', 'Thank You Message')}
							</Col>

							<Divider>Notification</Divider>

							<Col xs={24} sm={12}>
								{renderInputField(
									'resetCounterNotificationThresholdAmount',
									'Reset Counter Notification Threshold Amount',
									'number',
								)}
							</Col>

							<Col xs={24} sm={12}>
								{renderInputField(
									'resetCounterNotificationThresholdInvoiceNumber',
									'Reset Counter Notification Threshold Invoice Number',
									'number',
								)}
							</Col>

							<Divider>Store Details</Divider>

							<Col span={24}>{renderInputField('storeName', 'Store Name')}</Col>
							<Col span={24}>
								{renderInputField('addressOfTaxPayer', 'Address of Tax Payer')}
							</Col>
						</Row>

						<Divider />

						<Button
							type="submit"
							classNames="btn-submit-site-settings"
							text="Save Settings"
							variant="primary"
							block
						/>
					</Form>
				)}
			</Formik>
		</Spin>
	);
};
