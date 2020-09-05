import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from '../../components';

import './style.scss';

type IDashboardProps = ConnectedProps<typeof connector>;

const Dashboard = () => {
	return (
		<Container>
			<section className="Dashboard"></section>
		</Container>
	);
};

const mapDispatch = (dispatch: any) => ({
	...bindActionCreators({}, dispatch),
});

const connector = connect(null, mapDispatch);

export default connector(Dashboard);
