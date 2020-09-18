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
}

const Select = ({ options, placeholder, onChange, classNames, value }: Props) => (
	<select className={cn('Select', classNames)} onChange={(event) => onChange(event.target.value)}>
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
	defaultValue: null,
};

export default Select;
