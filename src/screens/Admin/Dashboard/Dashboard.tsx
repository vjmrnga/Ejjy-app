/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row } from 'antd';
import React from 'react';
import { Container } from '../../../components';
import { SiteSettings } from './components/SiteSettings';
import './style.scss';

const Dashboard = () => {
	return (
		<Container title="Dashboard" loadingText="Fetching site settings...">
			<section className="Dashboard">
				<Row gutter={{ sm: 15, xs: 0 }}>
					<Col xs={24} sm={12}>
						<SiteSettings />
					</Col>
				</Row>
			</section>
		</Container>
	);
};

export default Dashboard;
