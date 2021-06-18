import { CheckCircleOutlined } from '@ant-design/icons';
import cn from 'classnames';
import { FormikErrors } from 'formik';
import * as React from 'react';
import './style.scss';

interface Props {
	message: string | FormikErrors<any> | string[] | FormikErrors<any>[];
	classNames?: string;
}

const FieldSuccess = ({ message, classNames }: Props) => (
	<div className={cn('FieldSuccess', classNames)}>
		<CheckCircleOutlined className="icon" />
		<span className="text">{message}</span>
	</div>
);

export default FieldSuccess;
