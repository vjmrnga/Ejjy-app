import React from 'react';
import { Content } from '../../../components';
import { SalesBranchSection } from './components/SalesBranchSection';
import { SalesGrandTotalSection } from './components/SalesGrandTotalSection';

export const Sales = () => (
	<Content title="Sales">
		<SalesGrandTotalSection />
		<SalesBranchSection />
	</Content>
);
