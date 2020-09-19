import cn from 'classnames';
import * as React from 'react';
import './style.scss';

export interface Option {
	value: string;
	name: string;
	selected?: true | false;
}

interface Props {
	placeholder?: string;
	options: Option[];
	onChange: any;
	classNames?: any;
	value?: any;
	disabled?: boolean;
}

const Select = ({ options, placeholder, onChange, classNames, value, disabled }: Props) => (
	<select
		className={cn('Select', classNames, { disabled })}
		onChange={(event) => onChange(event.target.value)}
	>
		{placeholder && (
			<option value={null} selected disabled>
				{placeholder}
			</option>
		)}

		{options.map(({ name, value: optionValue }) => (
			<option key={optionValue} selected={optionValue === value} value={optionValue}>
				{name}
			</option>
		))}
	</select>
);

Select.defaultProps = {
	value: null,
	disabled: false,
};

export default Select;
