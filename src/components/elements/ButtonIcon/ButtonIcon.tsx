import * as React from 'react';
import './style.scss';
import cn from 'classnames';
import { Spin, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;

interface Props {
	icon: any;
	onClick: any;
	tooltip: string;
	loading?: boolean;
	disabled?: boolean;
	classNames?: any;
}

const ButtonIcon = ({ onClick, icon, tooltip, loading, disabled, classNames }: Props) => (
	<Tooltip placement="top" title={tooltip}>
		<button onClick={onClick} className={cn('ButtonIcon', classNames, { disabled, loading })}>
			{loading ? <Spin indicator={loadingIcon} /> : <>{icon}</>}
		</button>
	</Tooltip>
);

ButtonIcon.defaultProps = {
	onClick: null,
};

export default ButtonIcon;
