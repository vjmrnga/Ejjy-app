import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import './style.scss';

type IProductsProps = ConnectedProps<typeof connector>;

const Products = ({}: IProductsProps) => {
	return (
		<section className="Products">
			<p>Hello there!</p>
		</section>
	);
};

const mapDispatch = (dispatch: any) => ({
	...bindActionCreators({}, dispatch),
});

const connector = connect(null, mapDispatch);

export default connector(Products);
