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
	onSelect: any;
}

const StatusSelect = ({ options, placeholder, onSelect }: Props) => (
	<select className="StatusSelect">
		<option value="" selected disabled>
			{placeholder}
		</option>
		{options.map(({ name, value, selected = false }) => (
			<option selected={selected} value={value} onSelect={onSelect}>
				{name}
			</option>
		))}
	</select>
);

export default StatusSelect;
