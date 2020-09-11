import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from '../../../components';
import './style.scss';

type INotificationsProps = ConnectedProps<typeof connector>;

const Notifications = () => {
	return (
		<Container title="Notifications">
			<section className="Notifications">
				<p>Notifications content here</p>
			</section>
		</Container>
	);
};

const mapDispatch = (dispatch: any) => ({
	...bindActionCreators({}, dispatch),
});

const connector = connect(null, mapDispatch);

export default connector(Notifications);
