import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import './style.scss';

type IDashboardProps = ConnectedProps<typeof connector>;

const Dashboard = ({}: IDashboardProps) => {
	return (
		<section className="Dashboard">
			<p>Hello there!</p>
		</section>
	);
};

const mapDispatch = (dispatch: any) => ({
	...bindActionCreators({}, dispatch),
});

const connector = connect(null, mapDispatch);

export default connector(Dashboard);
