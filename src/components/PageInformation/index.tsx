import React, { useCallback, useEffect, useState } from 'react';
import { InfoOutlined, LaptopOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip, Typography } from 'antd';
import { appTypes, userTypes } from 'global';
import { useSiteSettings } from 'hooks';
import { matchPath, useLocation } from 'react-router';
import { useUserStore } from 'stores';
import { getAppType } from 'utils';
import npmPackage from '../../../package.json';
import adminData from './data/admin';
import backofficeData from './data/backoffice';
import commonData from './data/common';
import headofficeData from './data/headoffice';
import './style.scss';

const { Text } = Typography;

export const PageInformation = () => (
	<div className="PageInformation">
		<AppInformation />
		<ManualInformation />
	</div>
);

const ManualInformation = () => {
	const [dataSource, setDataSource] = useState([]);
	const user = useUserStore((state) => state.user);
	const { pathname } = useLocation();

	useEffect(() => {
		if (userTypes.ADMIN === user.user_type) {
			setDataSource(adminData);
		} else if (userTypes.BRANCH_MANAGER === user.user_type) {
			setDataSource(backofficeData);
		} else if (userTypes.OFFICE_MANAGER === user.user_type) {
			setDataSource(headofficeData);
		} else {
			setDataSource(commonData);
		}
	}, [user]);

	const getContent = useCallback(() => {
		const content = dataSource.find((item) =>
			matchPath(pathname, {
				path: item.path,
				exact: true,
				strict: false,
			}),
		);

		return content?.link;
	}, [dataSource, pathname]);

	return getContent() ? (
		<Tooltip placement="left" title="Page Information">
			<a href={getContent()} rel="noreferrer" target="_blank">
				<Button icon={<InfoOutlined />} shape="circle" />
			</a>
		</Tooltip>
	) : null;
};

const AppInformation = () => {
	const { data: siteSettings } = useSiteSettings();

	return (
		<Tooltip
			placement="left"
			title={
				<Space direction="vertical" size={0}>
					<Text style={{ color: 'white' }} strong>
						{getAppType() === appTypes.BACK_OFFICE
							? 'Back Office'
							: 'Head Office'}
					</Text>
					<Text style={{ color: 'white', whiteSpace: 'pre-line' }}>
						{siteSettings?.app_description}
					</Text>
					<Text style={{ color: 'white' }}>Version: {npmPackage.version}</Text>
				</Space>
			}
		>
			<Button icon={<LaptopOutlined />} shape="circle" />
		</Tooltip>
	);
};
