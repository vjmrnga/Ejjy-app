import { CloseCircleOutlined } from '@ant-design/icons';
import cn from 'classnames';
import { FormikErrors } from 'formik';
import * as React from 'react';
import './style.scss';

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
