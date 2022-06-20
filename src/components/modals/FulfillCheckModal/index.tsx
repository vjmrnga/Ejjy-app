/* eslint-disable no-mixed-spaces-and-tabs */
import { message, Modal } from 'antd';
import { RequestErrors } from 'components';
import { productCheckingTypes, quantityTypes, request } from 'global/types';
import { useProductCheckFulfill } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, convertToBulk } from 'utils';
import { FulfillCheckForm } from './FulfillCheckForm';

interface Props {
	productCheck: any;
	onSuccess: any;
	onClose: any;
}

export const FulfillCheckModal = ({
	productCheck,
	onSuccess,
	onClose,
}: Props) => {
	// STATES
	const [products, setProducts] = useState([]);

	// CUSTOM HOOKS
	const {
		mutateAsync: fulfillProductCheck,
		isLoading: isFulfilling,
		error: fulfillError,
	} = useProductCheckFulfill();

	// Effect: Format product check products
	useEffect(() => {
		if (productCheck) {
			const formattedProductCheckProducts = productCheck?.products?.map(
				(product) => ({
					name: product?.product?.name,
					barcode:
						product?.product?.barcode || product?.product?.selling_barcode,
					pieces_in_bulk: product?.product?.pieces_in_bulk,
					product_check_product_id: product?.id,
				}),
			);

			setProducts(formattedProductCheckProducts);
		}
	}, [productCheck]);

	const onFulfill = async (formData) => {
		const fulfilledProducts = formData.products.map((product) => {
			const quantity =
				product.quantityType === quantityTypes.PIECE
					? product.fulfilledQuantityPiece
					: convertToBulk(product.fulfilledQuantityPiece, product.piecesInBulk);

			return {
				product_check_product_id: product.productCheckProductId,
				fulfilled_quantity_piece: quantity,
			};
		});

		await fulfillProductCheck({
			id: productCheck.id,
			products: fulfilledProducts,
			type: productCheck.type,
		});

		message.success('Product check was fulfilled successfully');

		onSuccess();
		onClose();
	};

	return (
		<Modal
			title={
				productCheck?.type === productCheckingTypes.DAILY
					? 'Daily Check'
					: 'Random Check'
			}
			className="Modal__large"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors
				errors={convertIntoArray(fulfillError?.errors)}
				withSpaceBottom
			/>

			<FulfillCheckForm
				products={products}
				onSubmit={onFulfill}
				onClose={onClose}
				isLoading={isFulfilling}
			/>
		</Modal>
	);
};
