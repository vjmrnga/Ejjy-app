import { Space } from 'antd';
import cn from 'classnames';
import React from 'react';
import { FieldError } from '../elements';

interface Props {
	className?: string;
	errors: string[];
	withSpaceTop?: boolean;
	withSpaceBottom?: boolean;
}

export const RequestErrors = ({
	className,
	errors,
	withSpaceTop,
	withSpaceBottom,
}: Props) => (
	<Space
		className={cn('RequestErrors', 'w-100', className, {
			'mt-4': withSpaceTop,
			'mb-4': withSpaceBottom,
		})}
		direction="vertical"
	>
		{errors?.filter(Boolean)?.map((error, index) => (
			<FieldError key={index} error={error} />
		))}
	</Space>
);
