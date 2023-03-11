import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Col,
	DatePicker,
	Divider,
	Input,
	message,
	Radio,
	Row,
	Space,
	Spin,
	TimePicker,
} from 'antd';
import Upload, { RcFile } from 'antd/lib/upload';
import {
	ConnectionAlert,
	Content,
	RequestErrors,
	ScrollToFieldError,
	SiteSettingsInfo,
} from 'components';
import {
	Box,
	FieldError,
	FormattedInputNumber,
	Label,
} from 'components/elements';
import dayjs from 'dayjs';
import { ErrorMessage, Form, Formik } from 'formik';
import { inputTypes, taxTypes } from 'global';
import {
	usePingOnlineServer,
	useSiteSettingsEdit,
	useSiteSettings,
} from 'hooks';
import moment from 'moment';
import React, { useCallback } from 'react';
import { useUserStore } from 'stores';
import { convertIntoArray, isCUDShown } from 'utils';
import * as Yup from 'yup';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result as string));
	reader.readAsDataURL(img);
};

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

export const SiteSettings = () => {
	// CUSTOM HOOKS
	const { isConnected } = usePingOnlineServer();
	const user = useUserStore((state) => state.user);
	const {
		data: siteSettings,
		isFetching: isFetchingSiteSettings,
		error: siteSettingsError,
	} = useSiteSettings();
	const {
		mutateAsync: editSiteSettings,
		isLoading: isEditingSiteSettings,
		error: editSiteSettingsError,
	} = useSiteSettingsEdit();

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: siteSettings?.id,
				closeSessionDeadline: siteSettings?.close_session_deadline
					? moment(siteSettings.close_session_deadline, 'hh:mm:ss')
					: null,
				closeDayDeadline: siteSettings?.close_day_deadline
					? moment(siteSettings.close_day_deadline, 'hh:mm:ss')
					: null,
				isMarkdownAllowedIfCredit:
					siteSettings?.is_markdown_allowed_if_credit || false,
				isDiscountAllowedIfCredit:
					siteSettings?.is_discount_allowed_if_credit || false,
				isManualInputAllowed: siteSettings?.is_manual_input_allowed || false,
				isTimeCheckerFeatureEnabled:
					siteSettings?.is_time_checker_feature_enabled || false,

				proprietor: siteSettings?.proprietor || '',
				taxType: siteSettings?.tax_type || null,
				tin: siteSettings?.tin || '',
				permitNumber: siteSettings?.permit_number || '',
				contactNumber: siteSettings?.contact_number || '',

				softwareDeveloper: siteSettings?.software_developer || '',
				softwareDeveloperTin: siteSettings?.software_developer_tin || '',
				softwareDeveloperAddress:
					siteSettings?.software_developer_address || '',

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
				logoBase64: siteSettings?.logo_base64 || '',
			},
			Schema: Yup.object().shape({
				closeSessionDeadline: getValidTimeTest('Close Session Deadline').test(
					'5-minutes-before-close-day-deadline',
					'Close Session Deadline must be atleast 5 minutes before the Close Day Deadline',
					function test(value) {
						// NOTE: We need to use a no-named function so
						// we can use 'this' and access the other form field value.
						const closeSessionDeadline = dayjs(value);
						// eslint-disable-next-line react/no-this-in-sfc
						const closeDayDeadline = dayjs(this.parent.closeDayDeadline);

						return closeDayDeadline.diff(closeSessionDeadline, 'minute') >= 5;
					},
				),
				closeDayDeadline: getValidTimeTest('Close Day Deadline'),
				isMarkdownAllowedIfCredit: Yup.boolean()
					.required()
					.label('Markdown on Credit Transactions'),
				isDiscountAllowedIfCredit: Yup.boolean()
					.required()
					.label('Discount on Credit Transactions'),
				isManualInputAllowed: Yup.boolean()
					.required()
					.label('Manual Input for Weighing'),

				isTimeCheckerFeatureEnabled: Yup.boolean()
					.required()
					.label('Time Checker Feature'),

				proprietor: Yup.string().required().label('Proprietor'),
				taxType: Yup.string().required().label('Tax Type'),
				tin: Yup.string().required().label('TIN'),
				permitNumber: Yup.string().required().label('Permit Number'),
				contactNumber: Yup.string().required().label('Contact Number'),

				softwareDeveloper: Yup.string().required().label('Software Developer'),
				softwareDeveloperTin: Yup.string()
					.required()
					.label('Software Developer TIN'),
				softwareDeveloperAddress: Yup.string()
					.required()
					.label('Software Developer Address'),

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
				logoBase64: Yup.string().required().label('Store Logo'),
			}),
		}),
		[siteSettings],
	);

	const renderDatePicker = ({ name, label, values, setFieldValue }) => (
		<>
			<Label id={name} label={label} spacing />
			<DatePicker
				allowClear={false}
				className="w-100"
				format="YYYY-MM-DD"
				value={values[name]}
				onSelect={(value) => setFieldValue(name, value)}
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
				allowClear={false}
				className="w-100"
				format="h:mm A"
				name={name}
				value={values[name]}
				hideDisabledOptions
				use12Hours
				onSelect={(value) => setFieldValue(name, value)}
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
					name={name}
					type={type}
					value={values[name]}
					onChange={(e) => {
						setFieldValue(name, e.target.value);
					}}
				/>
			)}
			{type === inputTypes.TEXTAREA && (
				<Input.TextArea
					name={name}
					rows={3}
					value={values[name]}
					onChange={(e) => {
						setFieldValue(name, e.target.value);
					}}
				/>
			)}
			{type === inputTypes.MONEY && (
				<FormattedInputNumber
					className="w-100"
					controls={false}
					name={name}
					value={values[name]}
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

	const handleSubmit = async (formData) => {
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
		<Content title="Site Settings">
			<ConnectionAlert />

			<SiteSettingsInfo />

			<Box padding>
				<Spin spinning={isFetchingSiteSettings}>
					<RequestErrors
						errors={[
							...convertIntoArray(siteSettingsError),
							...convertIntoArray(editSiteSettingsError?.errors),
						]}
						withSpaceBottom
					/>

					<Formik
						initialValues={getFormDetails().DefaultValues}
						validationSchema={getFormDetails().Schema}
						enableReinitialize
						onSubmit={(formData) => {
							handleSubmit(formData);
						}}
					>
						{({ values, setFieldValue }) => (
							<Form>
								<ScrollToFieldError />

								<Row gutter={[16, 16]}>
									<Divider>Store Details</Divider>

									<Col md={12} span={24}>
										<Label label="Markdown on Credit Transactions" spacing />
										<Radio.Group
											options={[
												{ label: 'Allowed', value: true },
												{ label: 'Not Allowed', value: false },
											]}
											optionType="button"
											value={values['isMarkdownAllowedIfCredit']}
											onChange={(e) => {
												setFieldValue(
													'isMarkdownAllowedIfCredit',
													e.target.value,
												);
											}}
										/>
										<ErrorMessage
											name="isMarkdownAllowedIfCredit"
											render={(error) => <FieldError error={error} />}
										/>
									</Col>

									<Col md={12} span={24}>
										<Label label="Discount on Credit Transactions" spacing />
										<Radio.Group
											options={[
												{ label: 'Allowed', value: true },
												{ label: 'Not Allowed', value: false },
											]}
											optionType="button"
											value={values['isDiscountAllowedIfCredit']}
											onChange={(e) => {
												setFieldValue(
													'isDiscountAllowedIfCredit',
													e.target.value,
												);
											}}
										/>
										<ErrorMessage
											name="isDiscountAllowedIfCredit"
											render={(error) => <FieldError error={error} />}
										/>
									</Col>

									<Col md={12} span={24}>
										<Label label="Manual Input for Weighing" spacing />
										<Radio.Group
											options={[
												{ label: 'Allowed', value: true },
												{ label: 'Not Allowed', value: false },
											]}
											optionType="button"
											value={values['isManualInputAllowed']}
											onChange={(e) => {
												setFieldValue('isManualInputAllowed', e.target.value);
											}}
										/>
										<ErrorMessage
											name="isManualInputAllowed"
											render={(error) => <FieldError error={error} />}
										/>
									</Col>

									<Col md={12} span={24}>
										<Label label="Time Checker Feature" spacing />
										<Radio.Group
											options={[
												{ label: 'Enabled', value: true },
												{ label: 'Disabled', value: false },
											]}
											optionType="button"
											value={values['isTimeCheckerFeatureEnabled']}
											onChange={(e) => {
												setFieldValue(
													'isTimeCheckerFeatureEnabled',
													e.target.value,
												);
											}}
										/>
										<ErrorMessage
											name="isTimeCheckerFeatureEnabled"
											render={(error) => <FieldError error={error} />}
										/>
									</Col>

									<Divider>Receipt Header</Divider>

									<Col md={12} span={24}>
										{renderInputField({
											name: 'storeName',
											label: 'Store Name',
											type: inputTypes.TEXTAREA,
											setFieldValue,
											values,
										})}
									</Col>

									<Col md={12} span={24}>
										<Label label="Store Logo" spacing />
										<Upload
											beforeUpload={(file: any) => {
												getBase64(file, (url) => {
													console.log('url', url);
													setFieldValue('logoBase64', url);
												});

												return false;
											}}
											className="w-100 avatar-uploader"
											listType="picture-card"
											maxCount={1}
											showUploadList={false}
										>
											{values.logoBase64 ? (
												<img
													alt="store's logo"
													className="w-100"
													src={values.logoBase64}
												/>
											) : (
												<Space direction="horizontal">
													<PlusOutlined />
													<span className="mt-2">Upload</span>
												</Space>
											)}
										</Upload>
										<ErrorMessage
											name="logoBase64"
											render={(error) => <FieldError error={error} />}
										/>
									</Col>

									<Col md={12} span={24}>
										{renderInputField({
											name: 'addressOfTaxPayer',
											label: 'Address of Tax Payer',
											type: inputTypes.TEXTAREA,
											setFieldValue,
											values,
										})}
									</Col>

									<Col sm={12} xs={24}>
										{renderInputField({
											name: 'proprietor',
											label: 'Proprietor',
											setFieldValue,
											values,
										})}
									</Col>

									<Col md={12} span={24}>
										{renderInputField({
											name: 'contactNumber',
											label: 'Contact Number',
											setFieldValue,
											values,
										})}
									</Col>

									<Col sm={12} xs={24}>
										<Label label="VAT Type" spacing />
										<Radio.Group
											options={[
												{ label: 'VAT', value: taxTypes.VAT },
												{ label: 'NVAT', value: taxTypes.NVAT },
											]}
											optionType="button"
											value={values['taxType']}
											onChange={(e) => {
												setFieldValue('taxType', e.target.value);
											}}
										/>
										<ErrorMessage
											name="taxType"
											render={(error) => <FieldError error={error} />}
										/>
									</Col>

									<Col sm={12} xs={24}>
										{renderInputField({
											name: 'tin',
											label: 'TIN',
											setFieldValue,
											values,
										})}
									</Col>

									<Col sm={12} xs={24}>
										{renderInputField({
											name: 'permitNumber',
											label: 'Permit Number',
											setFieldValue,
											values,
										})}
									</Col>

									<Divider>Receipt Footer</Divider>

									<Col sm={12} xs={24}>
										{renderInputField({
											name: 'softwareDeveloper',
											label: 'Software Developer',
											setFieldValue,
											values,
										})}
									</Col>
									<Col sm={12} xs={24}>
										{renderInputField({
											name: 'softwareDeveloperTin',
											label: 'Software Developer TIN',
											setFieldValue,
											values,
										})}
									</Col>

									<Col xs={24}>
										{renderInputField({
											name: 'softwareDeveloperAddress',
											label: 'Software Developer Address',
											setFieldValue,
											type: inputTypes.TEXTAREA,
											values,
										})}
									</Col>

									<Col sm={8} xs={24}>
										{renderInputField({
											name: 'posAccreditationNumber',
											label: 'POS Accreditation Number',
											setFieldValue,
											values,
										})}
									</Col>

									<Col sm={8} xs={24}>
										{renderDatePicker({
											name: 'posAccreditationDate',
											label: 'POS Accreditation Date',
											values,
											setFieldValue,
										})}
									</Col>

									<Col sm={8} xs={24}>
										{renderDatePicker({
											name: 'posAccreditationValidUntilDate',
											label: 'POS Accreditation Valid Until Date',
											values,
											setFieldValue,
										})}
									</Col>

									<Col sm={8} xs={24}>
										{renderInputField({
											name: 'ptuNumber',
											label: 'PTU Number',
											setFieldValue,
											values,
										})}
									</Col>
									<Col sm={8} xs={24}>
										{renderDatePicker({
											name: 'ptuDate',
											label: 'PTU Date',
											values,
											setFieldValue,
										})}
									</Col>

									<Col sm={8} xs={24}>
										{renderDatePicker({
											name: 'ptuValidUntilDate',
											label: 'PTU Valid Until Date',
											values,
											setFieldValue,
										})}
									</Col>

									<Divider>Cashiering Details</Divider>

									<Col sm={12} xs={24}>
										{renderTimePicker({
											name: 'closeSessionDeadline',
											label: 'Close Session Deadline',
											values,
											setFieldValue,
										})}
									</Col>

									<Col sm={12} xs={24}>
										{renderTimePicker({
											name: 'closeDayDeadline',
											label: 'Close Day Deadline',
											values,
											setFieldValue,
										})}
									</Col>

									<Col sm={12} xs={24}>
										{renderInputField({
											name: 'reportingPeriodDayOfMonth',
											label: 'Reporting Day of the Month',
											type: inputTypes.NUMBER,
											setFieldValue,
											values,
										})}
									</Col>

									<Col sm={12} xs={24}>
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

									<Col sm={12} xs={24}>
										{renderInputField({
											name: 'resetCounterNotificationThresholdAmount',
											label: 'Reset Counter Notification Threshold Amount',
											type: inputTypes.MONEY,
											setFieldValue,
											values,
										})}
									</Col>

									<Col sm={12} xs={24}>
										{renderInputField({
											name: 'resetCounterNotificationThresholdInvoiceNumber',
											label:
												'Reset Counter Notification Threshold Invoice Number',
											type: inputTypes.NUMBER,
											setFieldValue,
											values,
										})}
									</Col>
								</Row>

								{isCUDShown(user.user_type) && (
									<>
										<Divider />

										<Button
											disabled={isConnected === false}
											htmlType="submit"
											loading={isEditingSiteSettings}
											type="primary"
											block
										>
											Save
										</Button>
									</>
								)}
							</Form>
						)}
					</Formik>
				</Spin>
			</Box>
		</Content>
	);
};
