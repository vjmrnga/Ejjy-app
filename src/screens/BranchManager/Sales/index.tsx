import { Content, TimeRangeFilter } from 'components';
import { Box } from 'components/elements';
import React from 'react';
import { SalesBranch } from './components/SalesBranch';

export const Sales = () => (
	<Content title="Sales">
		<Box padding>
			<TimeRangeFilter />

			<SalesBranch />
		</Box>
	</Content>
);
