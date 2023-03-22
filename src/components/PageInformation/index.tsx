import { InfoOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { userTypes } from 'global';
import React, { useCallback, useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router';
import { useUserStore } from 'stores';
import adminData from './data/admin';
import backofficeData from './data/backoffice';
import headofficeData from './data/headoffice';
import './style.scss';

export const PageInformation = () => {
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
		<div className="PageInformation">
			<Tooltip placement="left" title="Page Information">
				<a href={getContent()} rel="noreferrer" target="_blank">
					<Button
						className="PageInformation__button"
						icon={<InfoOutlined />}
						shape="circle"
					/>
				</a>
			</Tooltip>
		</div>
	) : null;
};
