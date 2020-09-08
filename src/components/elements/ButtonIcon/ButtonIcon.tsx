import * as React from 'react';
import './style.scss';
import cn from 'classnames';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;

export interface IButtonIconProps {
	icon: any;
	onClick?: any;
	loading?: boolean;
	disabled?: boolean;
	classNames: any;
}

const ButtonIcon = ({ onClick, icon, loading, disabled, classNames }: IButtonIconProps) => (
	<button onClick={onClick} className={cn('ButtonIcon', classNames, { disabled, loading })}>
		{loading ? <Spin indicator={loadingIcon} /> : <>{icon}</>}
	</button>
);

ButtonIcon.defaultProps = {
	onClick: null,
};

export default ButtonIcon;
