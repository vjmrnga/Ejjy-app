import { Field } from 'formik';
import * as React from 'react';
import './style.scss';

export interface IInputProps {
	id?: string;
	type?: string;
	placeholder?: string;
}

const Input = ({ type, id, placeholder }: IInputProps) => (
	<Field type={type} id={id} name={id} className="Input" placeholder={placeholder} />
);

Input.defaultProps = {
	type: 'text',
	placeholder: '',
};

export default Input;
