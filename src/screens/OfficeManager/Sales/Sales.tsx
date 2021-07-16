import React from 'react';
import { Container } from '../../../components';
import { SalesBranchSection } from './components/SalesBranchSection';
import { SalesGrandTotalSection } from './components/SalesGrandTotalSection';

const Sales = () => (
	<Container title="Sales">
		<section>
			<SalesGrandTotalSection />
			<SalesBranchSection />
		</section>
	</Container>
);

export default Sales;
