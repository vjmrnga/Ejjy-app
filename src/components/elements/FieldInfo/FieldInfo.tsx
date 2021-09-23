import { InfoCircleOutlined } from '@ant-design/icons';
import cn from 'classnames';
import { FormikErrors } from 'formik';
import * as React from 'react';
import './style.scss';

interface Props {
	message: string | FormikErrors<any> | string[] | FormikErrors<any>[];
	className?: string;
	withSpaceTop?: boolean;
	withSpaceBottom?: boolean;
}

const FieldInfo = ({
	message,
	className,
	withSpaceTop,
	withSpaceBottom,
}: Props) => (
	<div
		className={cn(
			'FieldInfo',
			{
				FieldInfo__spaceTop: withSpaceTop,
				FieldInfo__spaceBottom: withSpaceBottom,
			},
			className,
		)}
	>
		<InfoCircleOutlined className="FieldInfo_icon" />
		<span className="FieldInfo_text">{message}</span>
	</div>
);

export default FieldInfo;
