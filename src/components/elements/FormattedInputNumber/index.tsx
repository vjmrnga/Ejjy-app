import { InputNumber, InputNumberProps } from 'antd';
import React from 'react';

const formatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 2,
});

const FormattedInputNumber = (props: InputNumberProps) => (
	<InputNumber
		prefix="₱"
		formatter={(value, info) => {
			let formattedValue = '';
			if (info.userTyping) {
				formattedValue = `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			} else {
				formattedValue = value ? formatter.format(Number(value)) : '';
			}

			return formattedValue;
		}}
		parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
		decimalSeparator="."
		{...props}
	/>
);

export default FormattedInputNumber;
