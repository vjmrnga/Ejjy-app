import { message, Modal } from 'antd';
import { RequestErrors } from 'components';
import { MAX_PAGE_SIZE } from 'global';
import {
	useAuth,
	useBranches,
	useBranchProductEditPriceCost,
	useBranchProducts,
	usePriceMarkdownCreate,
} from 'hooks';
import React from 'react';
import { convertIntoArray, getId } from 'utils';
import { PricesForm } from './PricesForm';

interface Props {
	product: any;
	onClose: any;
}

export const PricesModal = ({ product, onClose }: Props) => {
	// CUSTOM HOOKS
	const {
		data: { branchProducts },
		isFetching: isFetchingBranchProducts,
	} = useBranchProducts({
		params: {
			productIds: product.id,
		},
		options: {
			enabled: product !== null,
		},
	});
	const { user } = useAuth();
	console.log('user', user);
	const {
		data: { branches },
		isFetching: isFetchingBranches,
	} = useBranches({
		key: 'PricesModalBranch',
		params: {
			pageSize: MAX_PAGE_SIZE,
		},
	});
	const {
		mutateAsync: createPriceMarkdown,
		isLoading: isCreatingPriceMarkdown,
		error: createPriceMarkdownError,
	} = usePriceMarkdownCreate();
	const {
		mutateAsync: editBranchProductPriceCost,
		isLoading: isEditingBranchProductPriceCost,
		error: editBranchProductPricCostError,
	} = useBranchProductEditPriceCost();

	// METHODS
	const handleSubmit = async ({
		branchProductFormData,
		priceMarkdownFormData,
	}) => {
		if (branchProductFormData.length > 0) {
			await editBranchProductPriceCost({
				actingUserId: getId(user),
				productId: getId(product),
				data: branchProductFormData,
			});
		}

		if (priceMarkdownFormData.length > 0) {
			await createPriceMarkdown({
				productId: getId(product),
				data: priceMarkdownFormData,
			});
		}

		message.success(`Prices for ${product.name} was set successfully`);
		onClose();
	};

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
				branches={branches}
				branchProducts={branchProducts}
				loading={
					isFetchingBranches ||
					isFetchingBranchProducts ||
					isCreatingPriceMarkdown ||
					isEditingBranchProductPriceCost
				}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
