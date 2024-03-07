import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import { CancelButtonIcon } from 'components';
import { getKeyDownCombination } from 'ejjy-global';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { EditProductModal } from 'screens/Shared/Cart/components/EditProductModal';
import { Table } from 'screens/Shared/Cart/components/ProductTable/components/Table';
import {
	NO_INDEX_SELECTED,
	PRODUCT_LENGTH_PER_PAGE,
	deleteItemShortcutKeys,
	editQuantityShortcutKeys,
} from 'screens/Shared/Cart/data';
import { useBoundStore } from 'screens/Shared/Cart/stores/useBoundStore';
import { formatQuantity } from 'utils';
import shallow from 'zustand/shallow';
import './style.scss';

const columns = [
	{ name: '', width: '1px' },
	{ name: 'Item', width: '50%' },
	{ name: 'Qty', width: '40%', alignment: 'center' },
];

export const editTypes = {
	ADD: 1,
	DEDUCT: 2,
};

interface Props {
	isLoading: boolean;
}

export const ProductTable = ({ isLoading }: Props) => {
	// STATES
	const [activeIndex, setActiveIndex] = useState(0);
	const [editProductModalVisible, setEditProductModalVisible] = useState(false);
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const {
		products,
		pageNumber,
		deleteProduct,
		nextPage,
		prevPage,
		resetPage,
	} = useBoundStore(
		(state: any) => ({
			products: state.products,
			pageNumber: state.pageNumber,
			deleteProduct: state.deleteProduct,
			nextPage: state.nextPage,
			prevPage: state.prevPage,
			resetPage: state.resetPage,
		}),
		shallow,
	);

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	useEffect(() => {
		const data = products
			.slice(
				(pageNumber - 1) * PRODUCT_LENGTH_PER_PAGE,
				pageNumber * PRODUCT_LENGTH_PER_PAGE,
			)
			.map((product, index) => [
				<CancelButtonIcon
					key="btnCancel"
					tooltip="Remove"
					onClick={() => showRemoveProductConfirmation(product)}
				/>,
				<Tooltip
					key="productName"
					placement="top"
					title={product.print_details}
				>
					{product.name}
				</Tooltip>,
				<Button
					key="btnEditQuantity"
					type="text"
					onClick={() => handleEdit(index)}
				>
					{formatQuantity({
						unitOfMeasurement: product.unit_of_measurement,
						quantity: product.quantity,
					})}
				</Button>,
			]);

		setDataSource(data);
	}, [pageNumber, products]);

	useEffect(() => {
		if (products.length === 0) {
			setActiveIndex(NO_INDEX_SELECTED);
			resetPage();
		} else if (products.length > 0 && activeIndex === NO_INDEX_SELECTED) {
			setActiveIndex(0);
			resetPage();
		}
	}, [products, activeIndex]);

	const showRemoveProductConfirmation = (product) => {
		Modal.confirm({
			className: 'EJJYModal Modal__hasFooter',
			title: 'Delete Confirmation',
			icon: <ExclamationCircleOutlined />,
			content: `Are you sure you want to delete ${product.name}?`,
			okText: 'Delete',
			cancelText: 'Cancel',
			onOk: () => {
				// Get new list of products where in passed product is filtered out.
				const newProducts = products.filter(({ key }) => key !== product.key);

				deleteProduct(product.key);

				// Checks if the current page has still products.
				// If none, go to previous page.
				const currentPageProducts = newProducts.slice(
					(pageNumber - 1) * PRODUCT_LENGTH_PER_PAGE,
					pageNumber * PRODUCT_LENGTH_PER_PAGE,
				);

				if (currentPageProducts.length === 0) {
					prevPage();
				}
			},
		});
	};

	const handleEdit = (index) => {
		const newIndex = (pageNumber - 1) * PRODUCT_LENGTH_PER_PAGE + index;
		setActiveIndex(newIndex);
		setEditProductModalVisible(true);
	};

	const handleKeyDown = _.throttle((event) => {
		// if (isModalVisible || isSearchSuggestionVisible) {
		// 	return;
		// }

		const key = getKeyDownCombination(event);

		// Edit
		if (editQuantityShortcutKeys.includes(key)) {
			setEditProductModalVisible(true);
			return;
		}

		// Delete
		if (deleteItemShortcutKeys.includes(key)) {
			showRemoveProductConfirmation(products?.[activeIndex]);
			return;
		}

		// Select products
		if (
			(key === 'ArrowUp' || key === 'ArrowDown') &&
			activeIndex === NO_INDEX_SELECTED
		) {
			setActiveIndex(0);
			return;
		}

		if (key === 'ArrowUp') {
			const value = activeIndex > 0 ? activeIndex - 1 : activeIndex;
			const newPage = _.floor(value / PRODUCT_LENGTH_PER_PAGE) + 1;
			if (newPage < pageNumber) {
				prevPage();
			}

			setActiveIndex(value);
			return;
		}

		if (key === 'ArrowDown') {
			let value = activeIndex;

			if (products?.length > 0 && activeIndex < products.length - 1) {
				value = activeIndex + 1;
			}

			const newPage = _.floor(value / PRODUCT_LENGTH_PER_PAGE) + 1;
			if (newPage > pageNumber) {
				nextPage();
			}

			setActiveIndex(value);
		}
	}, 500);

	return (
		<div className="ProductTable">
			<Table
				activeRow={activeIndex}
				columns={columns}
				data={dataSource}
				loading={isLoading}
			/>

			{editProductModalVisible && products?.[activeIndex] && (
				<EditProductModal
					product={products[activeIndex]}
					onClose={() => setEditProductModalVisible(false)}
				/>
			)}
		</div>
	);
};
