import React from 'react';
import { Container } from '../../../components';
import { BranchBalances } from './components/BranchBalances';
import './style.scss';

const Reports = () => (
	<Container title="Reports">
		<section className="Reports">
			<BranchBalances />
		</section>
	</Container>
);

export default Reports;
