import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from '../../../components';
import './style.scss';

type IPurchaseRequestsProps = ConnectedProps<typeof connector>;

const PurchaseRequests = () => {
	return (
		<Container title="PurchaseRequests">
			<section className="PurchaseRequests">
				<p>PurchaseRequests content here</p>
			</section>
		</Container>
	);
};

const mapDispatch = (dispatch: any) => ({
	...bindActionCreators({}, dispatch),
});

const connector = connect(null, mapDispatch);

export default connector(PurchaseRequests);
