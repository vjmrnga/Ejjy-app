import * as React from 'react';
import './style.scss';
import cn from 'classnames';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const loadingIcon = <LoadingOutlined style={{ fontSize: 17, color: 'white' }} spin />;

interface Props {
	text: string;
	variant: 'primary' | 'secondary' | 'default';
	onClick?: any;
	type?: 'button' | 'submit' | 'reset';
	icon?: any;
	iconDirection?: 'left' | 'right';
	loading?: boolean;
	disabled?: boolean;
	block?: boolean;
	classNames?: any;
}

const Button = ({
	text,
	variant,
	onClick,
	type,
	icon,
	iconDirection,
	block,
	loading,
	disabled,
	classNames,
}: Props) => (
	<button
		type={type}
		className={cn('Button', classNames, {
			primary: variant === 'primary',
			secondary: variant === 'secondary',
			default: variant === 'default',
			flex: !!icon,
			block,
			disabled,
			loading,
		})}
		onClick={onClick}
	>
		{loading ? (
			<Spin indicator={loadingIcon} className="spinner" />
		) : (
			<>
				{iconDirection === 'left' && <div className="icon-left">{icon}</div>}
				{text}
				{iconDirection === 'right' && <div className="icon-right">{icon}</div>}
			</>
		)}
	</button>
);

Button.defaultProps = {
	type: 'button',
	onClick: null,
	variant: 'default',
	iconDirection: null,
};

export default Button;
