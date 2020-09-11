import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from '../../../components';
import './style.scss';

type IOrderSlipsProps = ConnectedProps<typeof connector>;

const OrderSlips = () => {
	return (
		<Container title="OrderSlips">
			<section className="OrderSlips">
				<p>OrderSlips content here</p>
			</section>
		</Container>
	);
};

const mapDispatch = (dispatch: any) => ({
	...bindActionCreators({}, dispatch),
});

const connector = connect(null, mapDispatch);

export default connector(OrderSlips);
