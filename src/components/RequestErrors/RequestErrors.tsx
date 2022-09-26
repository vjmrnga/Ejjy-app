import { Space } from 'antd';
import cn from 'classnames';
import React from 'react';
import { FieldError } from '../elements';
import './style.scss';

interface Props {
	className?: string;
	errors: string[];
	size?: number;
	withSpaceTop?: boolean;
	withSpaceBottom?: boolean;
}

export const RequestErrors = ({
	className,
	errors,
	size,
	withSpaceTop,
	withSpaceBottom,
}: Props) => (
	<Space
		className={cn('RequestErrors', className, {
			RequestErrors__spaceTop: withSpaceTop,
			RequestErrors__spaceBottom: withSpaceBottom,
		})}
		direction="vertical"
		size={size}
	>
		{errors?.filter(Boolean)?.map((error, index) => (
			<FieldError key={index} error={error} />
		))}
	</Space>
);

RequestErrors.defaultProps = {
	size: 0,
	withSpaceTop: false,
	withSpaceBottom: false,
};
