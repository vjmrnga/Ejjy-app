import { ExclamationCircleOutlined } from '@ant-design/icons';
import cn from 'classnames';
import { FormikErrors } from 'formik';
import * as React from 'react';
import { ReactNode } from 'react';
import './style.scss';

interface Props {
	message:
		| string
		| FormikErrors<any>
		| string[]
		| FormikErrors<any>[]
		| ReactNode;
	classNames?: string;
	withSpaceTop?: boolean;
	withSpaceBottom?: boolean;
}

const FieldWarning = ({
	message,
	withSpaceTop,
	withSpaceBottom,
	classNames,
}: Props) => (
	<div
		className={cn(
			'FieldWarning',
			{
				FieldWarning__spaceTop: withSpaceTop,
				FieldWarning__spaceBottom: withSpaceBottom,
			},
			classNames,
		)}
	>
		<ExclamationCircleOutlined className="FieldWarning_icon" />
		<span className="FieldWarning_text">{message}</span>
	</div>
);

export default FieldWarning;
