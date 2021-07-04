import { Col, Row } from 'antd';
import React from 'react';
import { Container } from '../../../components';
import { SiteSettings } from './components/SiteSettings';
import './style.scss';

const Dashboard = () => (
	<Container title="Dashboard">
		<section className="Dashboard">
			{/* <Row gutter={{ sm: 15, xs: 0 }}>
				<Col span={24}>
					<SiteSettings />
				</Col>
			</Row> */}
		</section>
	</Container>
);

export default Dashboard;
