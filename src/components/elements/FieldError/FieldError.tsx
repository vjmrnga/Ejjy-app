import * as React from 'react';
import './style.scss';
import { CloseCircleOutlined } from '@ant-design/icons';
import { FormikErrors } from 'formik';

interface Props {
	error: string | FormikErrors<any> | string[] | FormikErrors<any>[];
}

const FieldError = ({ error }: Props) => (
	<div className="FieldError">
		<CloseCircleOutlined className="icon" />
		<span className="text">{error}</span>
	</div>
);

export default FieldError;
