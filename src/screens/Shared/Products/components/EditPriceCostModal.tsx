import { Modal } from 'antd';
import { cloneDeep, memoize, toString } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { request } from '../../../../global/types';
import { useBranches } from '../../../../hooks/useBranches';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import '../style.scss';
import { EditPriceCostForm } from './EditPriceCostForm';

interface Props {
	product: any;
	onClose: any;
}

export const EditPriceCostModal = ({ product, onClose }: Props) => {
	// VARIABLES
	const title = (
		<>
			<span>[Edit] Branch Product&apos;s Price Cost</span>
			<span className="ModalTitleMainInfo">{product?.name}</span>
		</>
	);

	// STATES
	const [response, setResponse] = useState([]);
	const [branches, setBranches] = useState([]);

	// CUSTOM HOOKS
	const { branches: branchesData } = useBranches();
	const { getBranchProduct, editBranchProductPriceCost } = useBranchProducts();

	// METHODS
	useEffect(() => {
		if (product) {
			setResponse([]);
			setBranches([]);
		}
	}, [product]);

	useEffect(() => {
		if (product) {
			setBranches(branchesData.filter(({ online_url }) => !!online_url));
		}
	}, [product, branchesData]);

	const isLoading = useCallback(
		() => response.some((status) => status === request.REQUESTING),
		[response],
	);

	const onEditPriceCost = (formData) => {
		formData.forEach((data, index) => {
			// only update edited branch product
			if (isValid(data)) {
				editBranchProductPriceCost(
					{
						branchId: data.branchId,
						productId: product.id,
						costPerPiece: getValue(data.cost_per_piece),
						costPerBulk: getValue(data.cost_per_bulk),
						pricePerPiece: getValue(data.price_per_piece),
						pricePerBulk: getValue(data.price_per_bulk),
					},
					({ status }) => {
						setResponse((value) => {
							const newValue = cloneDeep(value);
							newValue[index] = {
								updateStatus: status,
								message: 'Updating product details...',
							};
							return newValue;
						});
					},
				);
			} else {
				// Clear product values if not edited
				setResponse((value) => {
					const newValue = cloneDeep(value);
					newValue[index] = {
						fetchStatus: request.NONE,
					};
					return newValue;
				});

				setBranches((value) => {
					const updatedBranches = cloneDeep(value);
					updatedBranches[index] = {
						...updatedBranches[index],
						cost_per_piece: null,
						cost_per_bulk: null,
						price_per_piece: null,
						price_per_bulk: null,
					};

					return updatedBranches;
				});
			}
		});
	};

	const onFetchBranchProduct = (branchId, index) => {
		setResponse((value) => {
			const newValue = cloneDeep(value);
			Object.keys(newValue).forEach((key) => {
				newValue[key] = { updateStatus: request.NONE };
			});

			return newValue;
		});

		getBranchProduct(
			{
				page: 1,
				branchId,
				productIds: product.id,
			},
			({ status, data, warnings = [] }) => {
				setResponse((value) => {
					const newValue = cloneDeep(value);
					newValue[index] = {
						fetchStatus: status,
						message: 'Fetching product details...',
						warnings,
					};
					return newValue;
				});

				const fetchedProduct = data?.results?.[0];
				if (status === request.SUCCESS && fetchedProduct) {
					setBranches((value) => {
						const updatedBranches = cloneDeep(value);
						updatedBranches[index] = {
							...updatedBranches[index],
							cost_per_piece: fetchedProduct.cost_per_piece,
							cost_per_bulk: fetchedProduct.cost_per_bulk,
							price_per_piece: fetchedProduct.price_per_piece,
							price_per_bulk: fetchedProduct.price_per_bulk,
						};
						return updatedBranches;
					});
				}
			},
		);
	};

	const isValid = (data) =>
		toString(data.cost_per_piece) ||
		toString(data.cost_per_bulk) ||
		toString(data.price_per_piece) ||
		toString(data.price_per_bulk);

	const getValue = memoize((value) => {
		const valueString = toString(value);
		return valueString.length ? valueString : undefined;
	});

	return (
		<Modal
			className="EditPriceCostModal Modal__large"
			title={title}
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<EditPriceCostForm
				product={product}
				branches={branches}
				branchResponse={response}
				onFetchBranchProduct={onFetchBranchProduct}
				onSubmit={onEditPriceCost}
				onClose={onClose}
				loading={isLoading()}
			/>
		</Modal>
	);
};
