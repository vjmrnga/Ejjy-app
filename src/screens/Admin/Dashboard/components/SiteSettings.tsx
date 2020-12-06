/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Divider, message, Row, Spin, TimePicker } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Box, Button, Label } from '../../../../components/elements';
import { request } from '../../../../global/types';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export const SiteSettings = () => {
	const { siteSettings, getSiteSettings, editSiteSettings, status } = useSiteSettings();

	const [closeSessionDeadline, setCloseSessionDeadline] = useState(null);
	const [closeDayDeadline, setCloseDayDeadline] = useState(null);

	useEffect(() => {
		getSiteSettings();
	}, []);

	useEffect(() => {
		setCloseSessionDeadline(moment(siteSettings?.close_session_deadline, 'hh:mm:ss'));
		setCloseDayDeadline(moment(siteSettings?.close_day_deadline, 'hh:mm:ss'));
	}, [siteSettings]);

	const onPickSession = (time) => {
		setCloseSessionDeadline(time);
	};

	const onPickDay = (time) => {
		setCloseDayDeadline(time);
	};

	const onUpdateSiteSettings = () => {
		if (
			moment(siteSettings?.close_session_deadline, 'hh:mm:ss').isSame(closeSessionDeadline) &&
			moment(siteSettings?.close_day_deadline, 'hh:mm:ss').isSame(closeDayDeadline)
		) {
			message.error('You have not updated any of the time yet.');
			return;
		}

		editSiteSettings({
			id: siteSettings.id,
			close_session_deadline: closeSessionDeadline
				? closeSessionDeadline.format('HH:mm:ss')
				: siteSettings?.close_session_deadline,
			close_day_deadline: closeDayDeadline
				? closeDayDeadline.format('HH:mm:ss')
				: siteSettings?.close_day_deadline,
		});
	};

	return (
		<Box padding>
			<Spin size="large" spinning={status === request.REQUESTING}>
				<div className="site-settings-container">
					<p className="title">SITE SETTINGS</p>
					<Divider />
					<Row gutter={{ sm: 15, xs: 0 }}>
						<Col span={24}>
							<Label label="Close Day Session" spacing />
							<TimePicker
								value={closeSessionDeadline}
								style={{ width: '100%' }}
								format="h:mm a"
								minuteStep={5}
								onChange={onPickSession}
								hideDisabledOptions
								use12Hours
							/>
						</Col>
						<Col span={24} className="column-close-day-deadline">
							<Label label="Close Day Deadline" spacing />
							<TimePicker
								value={closeDayDeadline}
								style={{ width: '100%' }}
								format="h:mm a"
								minuteStep={5}
								onChange={onPickDay}
								hideDisabledOptions
								use12Hours
							/>
						</Col>
					</Row>

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
