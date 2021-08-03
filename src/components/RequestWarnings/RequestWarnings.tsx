import { Space } from 'antd';
import cn from 'classnames';
import React from 'react';
import FieldWarning from '../elements/FieldWarning/FieldWarning';
import './style.scss';

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
			RequestWarnings__spaceTop: withSpaceTop,
			RequestWarnings__spaceBottom: withSpaceBottom,
		})}
		direction="vertical"
		size={size}
	>
		{warnings?.map((warning, index) => (
			<FieldWarning key={index} message={warning} />
		))}
	</Space>
);

RequestWarnings.defaultProps = {
	size: 5,
	withSpaceTop: false,
	withSpaceBottom: false,
};
