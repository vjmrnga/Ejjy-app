import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './style.scss';

const Container = ({ children }) => {
	return (
		<section className="Main">
			<Sidebar />
			{children}
		</section>
	);
};

export default Container;
