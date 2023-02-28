import { InfoCircleFilled } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React, { useCallback } from 'react';
import { matchPath, useLocation } from 'react-router';
import './style.scss';

const data = [
	{
		path: '/office-manager/dashboard/',
		link: 'https://google.com',
	},
	{
		path: '/office-manager/products/',
		link: 'https://anydesk.com/',
	},
];

export const PageInfo = () => {
	const { pathname } = useLocation();

	const getContent = useCallback(() => {
		const content = data.find((item) =>
			matchPath(pathname, {
				path: item.path,
				exact: true,
				strict: false,
			}),
		);

		return content?.link;
	}, [data, pathname]);

	return getContent() ? (
		<div className="BaseInfo">
			<Tooltip placement="left" title="Page Information">
				<a href={getContent()} rel="noreferrer" target="_blank">
					<Button
						className="BaseInfo__button"
						icon={<InfoCircleFilled />}
						shape="circle"
					/>
				</a>
			</Tooltip>
		</div>
	) : null;
};
