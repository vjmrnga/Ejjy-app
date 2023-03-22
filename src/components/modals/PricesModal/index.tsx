import { message, Modal, Tabs } from 'antd';
import { RequestErrors } from 'components';
import { MAX_PAGE_SIZE, serviceTypes } from 'global';
import {
	useBranches,
	useBranchProductEditPriceCost,
	useBranchProducts,
	usePriceMarkdownCreate,
} from 'hooks';
import React from 'react';
import { useUserStore } from 'stores';
import {
	convertIntoArray,
	getGoogleApiUrl,
	getId,
	getLocalBranchId,
	isUserFromBranch,
	isUserFromOffice,
} from 'utils';
import { PricesForm } from './PricesForm';

const tabs = {
	ALL: 'General Products',
	BRANCHES: 'Branch Products',
};

interface Props {
	product: any;
	onClose: any;
}

export const PricesModal = ({ product, onClose }: Props) => {
	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const {
		data: { branchProducts },
		isFetching: isFetchingBranchProducts,
	} = useBranchProducts({
		params: {
			branchId: isUserFromBranch(user.user_type)
				? getLocalBranchId()
				: undefined,
			productIds: isUserFromBranch(user.user_type)
				? product.product.id
				: product.id,
			serviceType: serviceTypes.OFFLINE,
		},
		options: { enabled: product !== null },
	});
	const {
		data: { branches },
		isFetching: isFetchingBranches,
	} = useBranches({
		key: 'PricesModalBranch',
		params: { pageSize: MAX_PAGE_SIZE },
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
				serverUrl: isUserFromBranch(user.user_type)
					? undefined
					: getGoogleApiUrl(),
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

			{isUserFromBranch(user.user_type) ? (
				<PricesForm
					branches={branches}
					branchProducts={branchProducts}
					isLoading={
						isFetchingBranches ||
						isFetchingBranchProducts ||
						isCreatingPriceMarkdown ||
						isEditingBranchProductPriceCost
					}
					onClose={onClose}
					onSubmit={handleSubmit}
				/>
			) : (
				<Tabs
					defaultActiveKey={
						isUserFromOffice(user.user_type) ? tabs.ALL : tabs.BRANCHES
					}
					type="card"
					destroyInactiveTabPane
				>
					<Tabs.TabPane key={tabs.BRANCHES} tab={tabs.BRANCHES}>
						<PricesForm
							branches={branches}
							branchProducts={branchProducts}
							isLoading={
								isFetchingBranches ||
								isFetchingBranchProducts ||
								isCreatingPriceMarkdown ||
								isEditingBranchProductPriceCost
							}
							onClose={onClose}
							onSubmit={handleSubmit}
						/>
					</Tabs.TabPane>

					<Tabs.TabPane key={tabs.ALL} tab={tabs.ALL}>
						<PricesForm
							branches={branches}
							isLoading={
								isFetchingBranches ||
								isFetchingBranchProducts ||
								isCreatingPriceMarkdown ||
								isEditingBranchProductPriceCost
							}
							isBulkEdit
							onClose={onClose}
							onSubmit={handleSubmit}
						/>
					</Tabs.TabPane>
				</Tabs>
			)}
		</Modal>
	);
};
