/* eslint-disable react-hooks/exhaustive-deps */
import { Col, DatePicker, Divider, message, Row, Spin, TimePicker } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Box, Button, ControlledInput, Label } from '../../../../components/elements';
import { request } from '../../../../global/types';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export const SiteSettings = () => {
	const { siteSettings, getSiteSettings, editSiteSettings, status } = useSiteSettings();

	const [closeSessionDeadline, setCloseSessionDeadline] = useState(null);
	const [closeDayDeadline, setCloseDayDeadline] = useState(null);
	const [proprietor, setProprietor] = useState('');
	const [tin, setTin] = useState('');
	const [permitNumber, setPermitNumber] = useState('');
	const [softwareDeveloper, setSoftwareDeveloper] = useState('');
	const [softwareDeveloperTin, setSoftwareDeveloperTin] = useState('');
	const [posAccreditationNumber, setPosAccreditationNumber] = useState('');
	const [posAccreditationDate, setPosAccreditationDate] = useState(null);
	const [thankYouMessage, setThankYouMessage] = useState('');

	useEffect(() => {
		getSiteSettings();
	}, []);

	useEffect(() => {
		setCloseSessionDeadline(moment(siteSettings?.close_session_deadline, 'hh:mm:ss'));
		setCloseDayDeadline(moment(siteSettings?.close_day_deadline, 'hh:mm:ss'));

		setProprietor(siteSettings?.proprietor || '');
		setTin(siteSettings?.tin || '');
		setPermitNumber(siteSettings?.permit_number || '');
		setSoftwareDeveloper(siteSettings?.software_developer || '');
		setSoftwareDeveloperTin(siteSettings?.software_developer_tin || '');
		setPosAccreditationNumber(siteSettings?.pos_accreditation_number || '');
		setPosAccreditationDate(
			siteSettings?.pos_accreditation_date
				? moment(siteSettings?.pos_accreditation_date, 'YYYY-MM-DD')
				: null,
		);
		setThankYouMessage(siteSettings?.thank_you_message || '');
	}, [siteSettings]);

	const onUpdateSiteSettings = () => {
		const data = [
			closeSessionDeadline,
			closeDayDeadline,
			proprietor,
			tin,
			permitNumber,
			softwareDeveloper,
			softwareDeveloperTin,
			posAccreditationNumber,
			posAccreditationDate,
			thankYouMessage,
		];

		if (data.some((value) => isEmpty(value))) {
			message.error('Please make sure to fill all the fields.');
			return;
		}

		editSiteSettings({
			id: siteSettings.id,
			close_session_deadline: closeSessionDeadline.format('HH:mm:ss'),
			close_day_deadline: closeDayDeadline.format('HH:mm:ss'),
			proprietor: proprietor,
			tin: tin,
			permit_number: permitNumber,
			software_developer: softwareDeveloper,
			software_developer_tin: softwareDeveloperTin,
			pos_accreditation_number: posAccreditationNumber,
			pos_accreditation_date: posAccreditationDate.format('YYYY-MM-DD'),
			thank_you_message: thankYouMessage,
		});
	};

	return (
		<Box padding>
			<Spin size="large" spinning={status === request.REQUESTING}>
				<div className="site-settings-container">
					<p className="title">SITE SETTINGS</p>
					<Divider />
					<Row gutter={[15, 15]}>
						<Col xs={24} sm={12}>
							<Label label="Close Session Deadline" spacing />
							<TimePicker
								value={closeSessionDeadline}
								style={{ width: '100%' }}
								format="h:mm a"
								minuteStep={5}
								onSelect={(value) => setCloseSessionDeadline(value)}
								size="large"
								allowClear={false}
								hideDisabledOptions
								use12Hours
							/>
						</Col>
						<Col xs={24} sm={12}>
							<Label label="Close Day Deadline" spacing />
							<TimePicker
								value={closeDayDeadline}
								style={{ width: '100%' }}
								format="h:mm a"
								minuteStep={5}
								onSelect={(value) => setCloseDayDeadline(value)}
								size="large"
								allowClear={false}
								hideDisabledOptions
								use12Hours
							/>
						</Col>
					</Row>

					<Divider />

					<Row gutter={[15, 15]}>
						<Col xs={24} sm={12} md={8}>
							<Label label="Proprietor" spacing />
							<ControlledInput
								value={proprietor}
								onChange={(value) => setProprietor(value)}
								max={75}
							/>
						</Col>
						<Col xs={24} sm={12} md={8}>
							<Label label="Tin" spacing />
							<ControlledInput value={tin} onChange={(value) => setTin(value)} max={40} />
						</Col>
						<Col xs={24} sm={12} md={8}>
							<Label label="Permit Number" spacing />
							<ControlledInput
								value={permitNumber}
								onChange={(value) => setPermitNumber(value)}
								max={40}
							/>
						</Col>
						<Col xs={24} sm={12}>
							<Label label="Software Developer" spacing />
							<ControlledInput
								value={softwareDeveloper}
								onChange={(value) => setSoftwareDeveloper(value)}
								max={75}
							/>
						</Col>
						<Col xs={24} sm={12}>
							<Label label="Software Developer Tin" spacing />
							<ControlledInput
								value={softwareDeveloperTin}
								onChange={(value) => setSoftwareDeveloperTin(value)}
								max={40}
							/>
						</Col>
						<Col xs={24} sm={12}>
							<Label label="POS Accreditation Number" spacing />
							<ControlledInput
								value={posAccreditationNumber}
								onChange={(value) => setPosAccreditationNumber(value)}
								max={40}
							/>
						</Col>
						<Col xs={24} sm={12}>
							<Label label="POS Accreditation Date" spacing />
							<DatePicker
								value={posAccreditationDate}
								format="YYYY-MM-DD"
								onSelect={(value) => setPosAccreditationDate(value)}
								style={{ width: '100%' }}
								size="large"
								allowClear={false}
							/>
						</Col>
					</Row>

					<Divider />

					<Row gutter={[15, 15]}>
						<Col span={24}>
							<Label label="Thank You Message" spacing />
							<ControlledInput
								value={thankYouMessage}
								onChange={(value) => setThankYouMessage(value)}
								max={40}
							/>
						</Col>
					</Row>

					<Divider />

					<Button
						classNames="btn-submit-site-settings"
						text="Save Settings"
						variant="primary"
						onClick={onUpdateSiteSettings}
						disabled={!siteSettings}
						block
					/>
				</div>
			</Spin>
		</Box>
	);
};
