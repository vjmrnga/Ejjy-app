import React from 'react';
import { Container } from '../../../components';
import { BranchBalances } from './components/BranchBalances/BranchBalances';
import './style.scss';

const Dashboard = () => {
	return (
		<Container title="Dashboard">
			<section className="Dashboard">
				<BranchBalances />
			</section>
		</Container>
	);
};

export default Dashboard;
