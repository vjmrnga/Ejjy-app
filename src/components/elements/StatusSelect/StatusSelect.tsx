import cn from 'classnames';
import * as React from 'react';
import './style.scss';

export interface Option {
	value: string;
	name: string;
	selected?: true | false;
}

interface Props {
	placeholder: string;
	options: Option[];
	onChange: any;
	classNames: any;
}

const StatusSelect = ({ options, placeholder, onChange, classNames }: Props) => (
	<select className={cn('StatusSelect', classNames)} onChange={onChange}>
		<option value="" selected disabled>
			{placeholder}
		</option>
		{options.map(({ name, value, selected = false }) => (
			<option selected={selected} value={value}>
				{name}
			</option>
		))}
	</select>
);

export default StatusSelect;
