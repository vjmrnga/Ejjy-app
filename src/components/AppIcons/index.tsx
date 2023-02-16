import { WifiOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import cn from 'classnames';
import { useConnectivity } from 'hooks';
import React from 'react';
import './style.scss';

const Component = () => {
	// CUSTOM HOOKS
	const { isConnected } = useConnectivity();

	// METHODS
	const handleConnectionClick = () => {
		window.location.reload();
	};

	return (
		<div className="AppIcons">
			<Tooltip title="Connectivity Status">
				<WifiOutlined
					className={cn('AppIcons_icon', {
						'AppIcons_icon--warning': isConnected === null,
						'AppIcons_icon--success': isConnected === true,
						'AppIcons_icon--error': isConnected === false,
					})}
					onClick={handleConnectionClick}
				/>
			</Tooltip>
		</div>
	);
};

export const AppIcons = React.memo(Component);
