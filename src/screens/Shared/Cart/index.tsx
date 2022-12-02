import { Content, RequestErrors } from 'components';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useBoundStore } from 'screens/Shared/Cart/stores/useBoundStore';
import { convertIntoArray } from 'utils';
import shallow from 'zustand/shallow';
import { BarcodeScanner } from './components/BarcodeScanner';
import { FooterButtons } from './components/FooterButtons';
import { ProductSearch } from './components/ProductSearch';
import { ProductTable } from './components/ProductTable';
import './style.scss';

interface LocationState {
	title: string;
	onSubmit: any;
}

export const Cart = () => {
	// STATES
	const [barcodeScanLoading, setBarcodeScanLoading] = useState(false);
	const [responseError, setResponseError] = useState([]);

	// REFS
	const barcodeScannerRef = useRef(null);

	// CUSTOM HOOKS
	const history = useHistory<LocationState>();
	const { isLoading, setLoading } = useBoundStore(
		(state: any) => ({
			isLoading: state.isLoading,
			setLoading: state.setLoading,
		}),
		shallow,
	);

	// METHODS
	useEffect(() => {
		document.body.style.backgroundColor = 'white';

		return () => {
			document.body.style.backgroundColor = null;
		};
	}, []);

	useEffect(() => {
		if (!history.location.state) {
			history.replace('/');
		}
	}, [history.location.state]);

	const handleSubmit = () => {
		setLoading(true);
		const { products } = useBoundStore.getState();

		history.location.state
			.onSubmit(products)
			.catch((response) => {
				if (response.errors) {
					setResponseError(response.errors);
				}
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<Content title={`Create ${history.location.state?.title}`}>
			<BarcodeScanner
				ref={barcodeScannerRef}
				setLoading={setBarcodeScanLoading}
			/>

			<section className="Cart mt-6">
				<RequestErrors
					errors={convertIntoArray(responseError)}
					withSpaceBottom
				/>

				<ProductSearch barcodeScannerRef={barcodeScannerRef} />
				<ProductTable isLoading={barcodeScanLoading || isLoading} />
				<FooterButtons isDisabled={isLoading} onSubmit={handleSubmit} />
			</section>
		</Content>
	);
};
