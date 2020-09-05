import * as React from 'react';
import './style.scss';
import cn from 'classnames';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;

export interface IButtonProps {
	text: string;
	variant: 'primary' | 'secondary' | 'default';
	onClick?: any;
	icon?: any;
	iconDirection?: 'left' | 'right';
	loading?: boolean;
	disabled?: boolean;
	block?: boolean;
}

const Button = ({
	text,
	variant,
	onClick,
	icon,
	iconDirection,
	block,
	loading,
	disabled,
}: IButtonProps) => (
	<button
		className={cn('Button', {
			primary: variant === 'primary',
			secondary: variant === 'secondary',
			default: variant === 'default',
			block,
			disabled,
			loading,
		})}
		onClick={onClick}
	>
		{loading ? (
			<Spin indicator={loadingIcon} />
		) : (
			<>
				{iconDirection === 'left' && icon}
				{text}
				{iconDirection === 'right' && icon}
			</>
		)}
	</button>
);

Button.defaultProps = {
	onClick: null,
	variant: 'default',
	iconDirection: null,
};

export default Button;
