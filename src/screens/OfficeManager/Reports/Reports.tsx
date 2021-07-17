import React from 'react';
import { Content } from '../../../components';
import { BranchBalances } from './components/BranchBalances';
import './style.scss';

export const Reports = () => (
	<Content className="Reports" title="Reports">
		<BranchBalances />
	</Content>
);
