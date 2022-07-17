import { message, Modal } from 'antd';
import { RequestErrors } from 'components';
import {
	useBranchProductEditPriceCost,
	useBranchProductRetrieve,
	usePriceMarkdownsCreate,
} from 'hooks';
import _, { memoize } from 'lodash';
import React from 'react';
import { convertIntoArray } from 'utils';
import { PricesForm } from './PricesForm';

interface Props {
	product: any;
	onClose: any;
}

export const PricesModal = ({ product, onClose }: Props) => {
	// CUSTOM HOOKS
	const { data: branchProduct } = useBranchProductRetrieve({
		id: product?.id,
		options: {
			enabled: product !== null,
			refetchOnMount: 'always',
		},
	});
	const {
		mutateAsync: createPriceMarkdown,
		isLoading: isCreatePriceMarkdownLoading,
		error: createPriceMarkdownError,
	} = usePriceMarkdownsCreate();
	const {
		mutateAsync: editBranchProductPriceCost,
		isLoading: isEditingBranchProductPriceCost,
		error: editBranchProductPricCostError,
	} = useBranchProductEditPriceCost();

	// METHODS
	const onSubmit = async (formData) => {
		if (branchProduct.price_markdown?.type !== formData.type) {
			await createPriceMarkdown({
				branchProductId: branchProduct.id,
				type: formData.type,
			});
		}

		if (isValid(formData)) {
			await editBranchProductPriceCost({
				productId: product.id,
				costPerPiece: getValue(formData.costPerPiece),
				costPerBulk: getValue(formData.costPerBulk),
				pricePerPiece: getValue(formData.pricePerPiece),
				pricePerBulk: getValue(formData.pricePerBulk),
			});
		}

		message.success(`Prices for ${product.name} was set successfully`);
		onClose();
	};

	const isValid = (formData) =>
		_.toString(formData.costPerPiece) ||
		_.toString(formData.costPerBulk) ||
		_.toString(formData.pricePerPiece) ||
		_.toString(formData.pricePerBulk);

	const getValue = memoize((value) => {
		const valueString = _.toString(value);
		return valueString.length ? valueString : undefined;
	});

	return (
		<Modal
			footer={null}
			title={
				<>
					<span>Prices</span>
					<span className="ModalTitleMainInfo">{product.name}</span>
				</>
			}
			width={600}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(
						editBranchProductPricCostError?.errors,
						'Branch Product Price Cost',
					),
					...convertIntoArray(
						createPriceMarkdownError?.errors,
						'Price Markdown',
					),
				]}
				withSpaceBottom
			/>

			<PricesForm
				branchProduct={branchProduct}
				loading={
					isCreatePriceMarkdownLoading || isEditingBranchProductPriceCost
				}
				onClose={onClose}
				onSubmit={onSubmit}
			/>
		</Modal>
	);
};
