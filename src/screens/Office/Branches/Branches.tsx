import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from '../../../components';
import './style.scss';

type IBranchesProps = ConnectedProps<typeof connector>;

const Branches = () => {
	return (
		<Container title="Branches">
			<section className="Branches">
				<p>Branches content here</p>
			</section>
		</Container>
	);
};

const mapDispatch = (dispatch: any) => ({
	...bindActionCreators({}, dispatch),
});

const connector = connect(null, mapDispatch);

export default connector(Branches);
