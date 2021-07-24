import { InfoCircleOutlined } from '@ant-design/icons';
import cn from 'classnames';
import { FormikErrors } from 'formik';
import * as React from 'react';
import './style.scss';

interface Props {
	message: string | FormikErrors<any> | string[] | FormikErrors<any>[];
	className?: string;
}

const FieldSuccess = ({ message, className }: Props) => (
	<div className={cn('FieldInfo', className)}>
		<InfoCircleOutlined className="FieldInfo_icon" />
		<span className="FieldInfo_text">{message}</span>
	</div>
);

export default FieldSuccess;
