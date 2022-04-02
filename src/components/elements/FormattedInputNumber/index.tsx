import { InputNumber, InputNumberProps } from 'antd';
import React from 'react';

var formatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 2,

	// These options are needed to round to whole numbers if that's what you want.
	// (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
	//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const FormattedInputNumber = (props: InputNumberProps) => (
	<InputNumber
		prefix="₱"
		// formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} NOTE: This formatter does not display '00' in decimal places
		formatter={(value) => (value ? formatter.format(Number(value)) : '')}
		parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
		decimalSeparator="."
		{...props}
	/>
);

export default FormattedInputNumber;
