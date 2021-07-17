import React from 'react';
import { Content } from '../../../components';
import { BranchBalances } from './components/BranchBalances/BranchBalances';
import './style.scss';

export const Dashboard = () => (
	<Content className="Dashboard" title="Dashboard">
		<BranchBalances />
	</Content>
);
