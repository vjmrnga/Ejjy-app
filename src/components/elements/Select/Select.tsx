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
	defaultValue?: any;
}

const Select = ({ options, placeholder, onChange, classNames, defaultValue }: Props) => (
	<select
		className={cn('Select', classNames)}
		onChange={(event) => onChange(event.target.value)}
		defaultValue={defaultValue}
	>
		{placeholder && (
			<option value="" selected disabled>
				{placeholder}
			</option>
		)}

		{options.map(({ name, value, selected = false }) => (
			<option selected={selected} value={value}>
				{name}
			</option>
		))}
	</select>
);

Select.defaultProps = {
	defaultValue: null,
};

export default Select;
