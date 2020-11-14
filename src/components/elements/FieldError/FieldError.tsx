import * as React from 'react';
import './style.scss';
import { CloseCircleOutlined } from '@ant-design/icons';
import { FormikErrors } from 'formik';
import cn from 'classnames';

interface Props {
	error: string | FormikErrors<any> | string[] | FormikErrors<any>[];
	classNames?: string;
}

const FieldError = ({ error, classNames }: Props) => (
	<div className={cn('FieldError', classNames)}>
		<CloseCircleOutlined className="icon" />
		<span className="text">{error}</span>
	</div>
);

export default FieldError;
