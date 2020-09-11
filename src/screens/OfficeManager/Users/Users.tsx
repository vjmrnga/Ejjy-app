import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from '../../../components';
import './style.scss';

type IUsersProps = ConnectedProps<typeof connector>;

const Users = () => {
	return (
		<Container title="Users">
			<section className="Users">
				<p>Users content here</p>
			</section>
		</Container>
	);
};

const mapDispatch = (dispatch: any) => ({
	...bindActionCreators({}, dispatch),
});

const connector = connect(null, mapDispatch);

export default connector(Users);
