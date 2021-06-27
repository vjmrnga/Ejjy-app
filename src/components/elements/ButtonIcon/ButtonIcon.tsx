import * as React from 'react';
import './style.scss';
import cn from 'classnames';
import { Spin, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;

interface Props {
	type?: 'button' | 'submit' | 'reset';
	icon: any;
	onClick: any;
	tooltip: string;
	loading?: boolean;
	disabled?: boolean;
	classNames?: any;
}

const ButtonIcon = ({ type, icon, tooltip, loading, disabled, onClick, classNames }: Props) => (
	<Tooltip placement="top" title={tooltip}>
		<button
			type={type}
			onClick={onClick}
			className={cn('ButtonIcon', classNames, { disabled, loading })}
		>
			{loading ? <Spin indicator={loadingIcon} /> : <>{icon}</>}
		</button>
	</Tooltip>
);

ButtonIcon.defaultProps = {
	type: 'button',
	onClick: null,
};

export default ButtonIcon;
