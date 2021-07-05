import { Space } from 'antd';
import cn from 'classnames';
import React from 'react';
import { FieldError } from '../elements';
import './style.scss';
import FieldWarning from '../elements/FieldWarning/FieldWarning';

interface Props {
	warnings: string[];
	size?: number;
	withSpaceTop?: boolean;
	withSpaceBottom?: boolean;
}

export const RequestWarnings = ({
	warnings,
	size,
	withSpaceTop,
	withSpaceBottom,
}: Props) => (
	<Space
		className={cn('RequestWarnings', {
			RequestWarnings___spaceTop: withSpaceTop,
			RequestWarnings___spaceBottom: withSpaceBottom,
		})}
		direction="vertical"
		size={size}
	>
		{warnings?.map((warning, index) => (
			<FieldWarning key={index} error={warning} />
		))}
	</Space>
);

RequestWarnings.defaultProps = {
	size: 5,
	withSpaceTop: false,
	withSpaceBottom: false,
};
