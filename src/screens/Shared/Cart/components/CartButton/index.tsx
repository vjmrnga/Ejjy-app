import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import cn from 'classnames';
import * as React from 'react';
import './style.scss';

const loadingIcon = (
	<LoadingOutlined style={{ fontSize: 17, color: 'white' }} spin />
);

interface Props {
	text: string | React.ReactNode;
	variant?: 'primary' | 'secondary' | 'default' | 'dark-gray';
	size?: 'md' | 'lg';
	onClick?: any;
	type?: 'button' | 'submit' | 'reset';
	icon?: any;
	iconDirection?: 'left' | 'right';
	loading?: boolean;
	disabled?: boolean;
	block?: boolean;
	className?: any;
	tooltipPlacement?: TooltipPlacement;
	tooltip?: string;
	shortcutKey?: string;
	tabIndex?: number;
}

// eslint-disable-next-line react/display-name
const CartButton = React.forwardRef<HTMLInputElement, Props>(
	(
		{
			text,
			variant,
			onClick,
			type,
			icon,
			iconDirection,
			block,
			loading,
			disabled,
			className,
			tooltipPlacement,
			tooltip,
			size,
			shortcutKey,
			tabIndex,
		}: Props,
		ref,
	) => (
		<Tooltip
			overlayClassName="button-tooltip"
			placement={tooltipPlacement}
			title={tooltip}
		>
			<button
				ref={ref}
				className={cn('CartButton', className, {
					[variant]: true,
					[size]: true,
					flex: !!icon,
					hasShortcutKey: !!shortcutKey,
					block,
					disabled,
					loading,
				})}
				tabIndex={tabIndex}
				// eslint-disable-next-line react/button-has-type
				type={type}
				onClick={disabled ? null : onClick}
			>
				{loading ? (
					<Spin className="spinner" indicator={loadingIcon} />
				) : (
					<>
						{iconDirection === 'left' && (
							<div className="icon-left">{icon}</div>
						)}
						{shortcutKey ? (
							<>
								<span>{text}</span>
								<span className="shortcut-key">[{shortcutKey}]</span>
							</>
						) : (
							text
						)}
						{iconDirection === 'right' && (
							<div className="icon-right">{icon}</div>
						)}
					</>
				)}
			</button>
		</Tooltip>
	),
);

CartButton.defaultProps = {
	tooltipPlacement: 'top',
	type: 'button',
	onClick: null,
	variant: 'default',
	size: 'md',
	iconDirection: null,
	tabIndex: 0,
};

export default CartButton;
