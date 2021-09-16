/* eslint-disable no-mixed-spaces-and-tabs */
import { Col, DatePicker, Divider, message, Row, Spin, TimePicker } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { RequestErrors, TableHeader } from '../../../../components';
import {
	Button,
	FieldError,
	FormInputLabel,
	Label,
} from '../../../../components/elements';
import { request } from '../../../../global/types';
import { useSiteSettings } from '../../../../hooks/useSiteSettings';
import { convertIntoArray, sleep } from '../../../../utils/function';

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
}

export const ViewBranchSiteSettings = ({ branchId }: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);
	const [siteSettings, setSiteSettings] = useState(null);

	// CUSTOM HOOKS
	const {
		getSiteSettings,
		editSiteSettings,
		status: siteSettingsStatus,
		errors: siteSettingsErrors,
	} = useSiteSettings();

	// METHODS
	useEffect(() => {
		getSiteSettings({ branchId }, ({ status, data }) => {
			if (status === request.SUCCESS) {
				setSiteSettings(data);
			}
		});
	}, []);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchId,
				id: siteSettings?.id,
				close_session_deadline: siteSettings?.close_session_deadline
					? moment(siteSettings.close_session_deadline, 'hh:mm:ss')
					: null,
				close_day_deadline: siteSettings?.close_day_deadline
					? moment(siteSettings.close_day_deadline, 'hh:mm:ss')
					: null,

				proprietor: siteSettings?.proprietor || '',
				tin: siteSettings?.tin || '',
				permit_number: siteSettings?.permit_number || '',

				software_developer: siteSettings?.software_developer || '',
				software_developer_tin: siteSettings?.software_developer_tin || '',

				pos_accreditation_number: siteSettings?.pos_accreditation_number || '',
				pos_accreditation_date: siteSettings?.pos_accreditation_date
					? moment(siteSettings.pos_accreditation_date, 'YYYY-MM-DD')
					: null,
				pos_accreditation_valid_until_date:
					siteSettings?.pos_accreditation_valid_until_date
						? moment(
								siteSettings.pos_accreditation_valid_until_date,
								'YYYY-MM-DD',
						  )
						: null,

				ptu_number: siteSettings?.ptuNumber || '',
				ptu_date: siteSettings?.ptuDate
					? moment(siteSettings.ptuDate, 'YYYY-MM-DD')
					: null,
				ptu_valid_until_date: siteSettings?.ptuValidUntilDate
					? moment(siteSettings.ptuValidUntilDate, 'YYYY-MM-DD')
					: null,

				product_version: siteSettings?.product_version || '',
				thank_you_message: siteSettings?.thank_you_message || '',
			},
			Schema: Yup.object().shape({
				close_session_deadline: getValidTimeTest('Close Session Deadline'),
				close_day_deadline: getValidTimeTest('Close Day Deadline'),

				proprietor: Yup.string().required().label('Proprietor'),
				tin: Yup.string().required().label('TIN'),
				permit_number: Yup.string().required().label('Permit Number'),
				software_developer: Yup.string().required().label('Software Developer'),
				software_developer_tin: Yup.string()
					.required()
					.label('Software Developer TIN'),

				pos_accreditation_number: Yup.string()
					.required()
					.label('POS Accreditation Number'),
				pos_accreditation_date: getValidDateTest('POS Accreditation Date'),
				pos_accreditation_valid_until_date: getValidDateTest(
					'POS Accreditation Valid Until Date',
				),

				ptu_number: Yup.string().required().label('PTU Number'),
				ptu_date: getValidDateTest('PTU Date'),
				ptu_valid_until_date: getValidDateTest('PTU Valid Until Date'),

				product_version: Yup.string().required().label('Product Version'),
				thank_you_message: Yup.string().required().label('Thank You Message'),
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

	const renderInputField = (name, label) => (
		<>
			<FormInputLabel id={name} label={label} />
			<ErrorMessage
				name={name}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);

	const onSubmit = (formData) => {
		editSiteSettings(
			{
				...formData,
				close_session_deadline:
					formData.close_session_deadline.format('HH:mm:ss'),
				close_day_deadline: formData.close_day_deadline.format('HH:mm:ss'),
				pos_accreditation_date:
					formData.pos_accreditation_date.format('YYYY-MM-DD'),
				pos_accreditation_valid_until_date:
					formData.pos_accreditation_valid_until_date.format('YYYY-MM-DD'),
				ptu_date: formData.ptu_date.format('YYYY-MM-DD'),
				ptu_valid_until_date:
					formData.ptu_valid_until_date.format('YYYY-MM-DD'),
			},
			(status) => {
				if (status === request.SUCCESS) {
					message.success('Successfully updated site settings.');
				}
			},
		);
	};

	return (
		<Spin
			size="large"
			spinning={siteSettingsStatus === request.REQUESTING || isSubmitting}
		>
			<TableHeader title="Site Settings" />

			<RequestErrors
				errors={convertIntoArray(siteSettingsErrors)}
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
									'close_session_deadline',
									'Close Session Deadline',
									values,
									setFieldValue,
								)}
							</Col>
							<Col xs={24} sm={12}>
								{renderTimePicker(
									'close_day_deadline',
									'Close Day Deadline',
									values,
									setFieldValue,
								)}
							</Col>

							<Col xs={24} sm={12} md={8}>
								{renderInputField('proprietor', 'Proprietor')}
							</Col>
							<Col xs={24} sm={12} md={8}>
								{renderInputField('tin', 'TIN')}
							</Col>
							<Col xs={24} sm={12} md={8}>
								{renderInputField('permit_number', 'Permit Number')}
							</Col>
							<Col xs={24} sm={12}>
								{renderInputField('software_developer', 'Software Developer')}
							</Col>
							<Col xs={24} sm={12}>
								{renderInputField(
									'software_developer_tin',
									'Software Developer TIN',
								)}
							</Col>

							<Col xs={24} sm={8}>
								{renderInputField(
									'pos_accreditation_number',
									'POS Accreditation Number',
								)}
							</Col>
							<Col xs={24} sm={8}>
								{renderDatePicker(
									'pos_accreditation_date',
									'POS Accreditation Date',
									values,
									setFieldValue,
								)}
							</Col>

							<Col xs={24} sm={8}>
								{renderDatePicker(
									'pos_accreditation_valid_until_date',
									'POS Accreditation Valid Until Date',
									values,
									setFieldValue,
								)}
							</Col>

							<Col xs={24} sm={8}>
								{renderInputField('ptu_number', 'PTU Number')}
							</Col>
							<Col xs={24} sm={8}>
								{renderDatePicker(
									'ptu_date',
									'PTU Date',
									values,
									setFieldValue,
								)}
							</Col>

							<Col xs={24} sm={8}>
								{renderDatePicker(
									'ptu_valid_until_date',
									'PTU Valid Until Date',
									values,
									setFieldValue,
								)}
							</Col>

							<Col xs={24}>
								{renderInputField('product_version', 'Product Version')}
							</Col>

							<Col xs={24}>
								{renderInputField('thank_you_message', 'Thank You Message')}
							</Col>
						</Row>

						<Divider />

						<Button
							type="submit"
							classNames="btn-submit-site-settings"
							text="Save Settings"
							variant="primary"
							// disabled={!siteSettings}
							block
						/>
					</Form>
				)}
			</Formik>
		</Spin>
	);
};
