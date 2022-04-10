import { message, Modal, Spin } from 'antd';
import { RequestErrors } from 'components';
import { request } from 'global';
import { usePriceMarkdownsCreate } from 'hooks';
import { useBranchProducts } from 'hooks/useBranchProducts';
import React, { useEffect, useState } from 'react';
import { convertIntoArray } from 'utils/function';
import { PriceMarkdownForm } from './PriceMarkdownForm';

interface Props {
	product: any;
	onClose: any;
}

export const PriceMarkdownModal = ({ product, onClose }: Props) => {
	// STATES
	const [branchProduct, setBranchProduct] = useState(null);

	// CUSTOM HOOKS
	const {
		getBranchProduct,
		status: branchProductsStatus,
		errors: branchProductsErrors,
	} = useBranchProducts();
	const {
		mutateAsync: createPriceMarkdown,
		isLoading: isCreatePriceMarkdownLoading,
		error: createPriceMarkdownError,
	} = usePriceMarkdownsCreate();

	// METHODS
	useEffect(() => {
		getBranchProduct({ productIds: product.id }, ({ status, data }) => {
			if (status === request.SUCCESS) {
				setBranchProduct(data.results[0]);
			}
		});
	}, [product]);

	const onSubmit = async (formData) => {
		await createPriceMarkdown({
			branchProductId: branchProduct.id,
			type: formData.type,
		});

		message.success(`Markdown for ${product.name} was set successfully`);
		onClose();
	};

	return (
		<Modal
			title={
				<>
					<span>Price Markdown</span>
					<span className="ModalTitleMainInfo">{product.name}</span>
				</>
			}
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
			width={600}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(branchProductsErrors, 'Branch Products'),
					...convertIntoArray(
						createPriceMarkdownError?.errors,
						'Price Markdown',
					),
				]}
				withSpaceBottom
			/>

			<PriceMarkdownForm
				branchProduct={branchProduct}
				onSubmit={onSubmit}
				onClose={onClose}
				loading={isCreatePriceMarkdownLoading}
			/>
		</Modal>
	);
};
