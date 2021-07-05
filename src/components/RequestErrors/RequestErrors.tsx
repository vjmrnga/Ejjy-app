import { Space } from 'antd';
import cn from 'classnames';
import React from 'react';
import { FieldError } from '../elements';
import './style.scss';

interface Props {
	errors: string[];
	size?: number;
	withSpaceTop?: boolean;
	withSpaceBottom?: boolean;
}

export const RequestErrors = ({
	errors,
	size,
	withSpaceTop,
	withSpaceBottom,
}: Props) => (
	<Space
		className={cn('RequestErrors', {
			RequestErrors___spaceTop: withSpaceTop,
			RequestErrors___spaceBottom: withSpaceBottom,
		})}
		direction="vertical"
		size={size}
	>
		{errors?.map((error, index) => (
			<FieldError key={index} error={error} />
		))}
	</Space>
);

RequestErrors.defaultProps = {
	size: 15,
	withSpaceTop: false,
	withSpaceBottom: false,
};
