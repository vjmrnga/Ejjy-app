import cn from 'classnames';
import * as React from 'react';
import './style.scss';

interface Props {
	autoFocus?: boolean;
	className?: any;
	disabled?: boolean;
	id?: string;
	max?: number;
	min?: number;
	onChange: any;
	onClick?: any;
	onFocus?: any;
	placeholder?: string;
	type?: string;
	value: any;
	// eslint-disable-next-line react/no-unused-prop-types
	ref?: any;
}

// eslint-disable-next-line react/display-name
const ControlledInput = React.forwardRef<HTMLInputElement, Props>(
	(
		{
			autoFocus,
			className,
			disabled,
			id,
			max,
			min,
			onChange,
			onClick,
			onFocus,
			placeholder,
			type,
			value,
		}: Props,
		ref,
	) => (
		<input
			ref={ref}
			// eslint-disable-next-line jsx-a11y/no-autofocus
			autoFocus={autoFocus}
			className={cn('Input', className)}
			disabled={disabled}
			id={id}
			max={max}
			min={min}
			name={id}
			placeholder={placeholder}
			type={type}
			value={value}
			onChange={(event) => onChange(event.target.value)}
			onClick={onClick}
			onFocus={(event) => {
				if (onFocus) onFocus(event.target.value);
			}}
		/>
	),
);

ControlledInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default ControlledInput;
