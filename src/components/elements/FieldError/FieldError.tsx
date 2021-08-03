import { CloseCircleOutlined } from '@ant-design/icons';
import cn from 'classnames';
import { FormikErrors } from 'formik';
import * as React from 'react';
import './style.scss';

interface Props {
	error: string | FormikErrors<any> | string[] | FormikErrors<any>[];
	classNames?: string;
	withSpaceTop?: boolean;
	withSpaceBottom?: boolean;
}

const FieldError = ({
	error,
	classNames,
	withSpaceTop,
	withSpaceBottom,
}: Props) => (
	<div
		className={cn(
			'FieldError',
			{
				FieldError__spaceTop: withSpaceTop,
				FieldError__spaceBottom: withSpaceBottom,
			},
			classNames,
		)}
	>
		<CloseCircleOutlined className="FieldError_icon" />
		<span className="FieldError_text">{error}</span>
	</div>
);

export default FieldError;
