import { InputNumber, InputNumberProps } from 'antd';
import React from 'react';

const FormattedInputNumber = (props: InputNumberProps) => (
	<InputNumber
		prefix="₱"
		formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
		parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
		{...props}
	/>
);

export default FormattedInputNumber;
