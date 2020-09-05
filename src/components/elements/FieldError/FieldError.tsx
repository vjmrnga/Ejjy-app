import * as React from 'react';
import './style.scss';
import { CloseCircleOutlined } from '@ant-design/icons';

export interface IFieldErrorProps {
	error: string;
}

const FieldError = ({ error }: IFieldErrorProps) => (
	<div className="FieldError">
		<CloseCircleOutlined className="icon" />
		<span className="text">{error}</span>
	</div>
);

export default FieldError;
