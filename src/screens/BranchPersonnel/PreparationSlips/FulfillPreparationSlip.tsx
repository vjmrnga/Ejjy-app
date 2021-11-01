import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, message, Modal, Spin } from 'antd';
import { debounce, throttle, toString } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { useHistory } from 'react-router-dom';
import {
	CheckIcon,
	Content,
	PreparationSlipDetails,
	RequestErrors,
	TableNormal,
} from '../../../components';
import { Box, Button, Label } from '../../../components/elements';
import { KeyboardButton } from '../../../components/KeyboardButton/KeyboardButton';
import { IS_APP_LIVE, SEARCH_DEBOUNCE_TIME } from '../../../global/constants';
import {
	preparationSlipStatus,
	request,
	unitOfMeasurementTypes,
} from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { usePreparationSlips } from '../../../hooks/usePreparationSlips';
import {
	convertIntoArray,
	formatQuantity,
	getKeyDownCombination,
} from '../../../utils/function';
import { FULFILL_TYPES } from './components/constants';
import { FulfillSlipModal } from './components/FulfillSlipModal';
import './style.scss';

const columns = [
	{ name: 'Name' },
	{ name: 'Ordered', center: true },
	{ name: 'Inputted', center: true },
];

const MESSAGE_KEY = 'MESSAGE_KEY_BARCODE_SCAN_MSG';
const MESSAGE_KEY_RESULT = 'MESSAGE_KEY_BARCODE_SCAN_RESULT_MSG';

const showConfirmation = (onOk, productNames) => {
	Modal.confirm({
		className: 'Modal__hasFooter',
		title: 'Confirmation',
		content: (
			<>
				<p>
					It seems that some products have mismatches in ordered and inputted
					quantities.
				</p>

				<p>
					Products:
					<ul>
						{productNames.map((name) => (
							<li key={name}>{name}</li>
						))}
					</ul>
				</p>

				<p>
					Are you sure you want to continue fulfilling this preparation slip?
				</p>
			</>
		),
		icon: <ExclamationCircleOutlined />,
		okText: 'Yes, fulfill now',
		cancelText: 'No',
		onOk,
		closable: true,
		centered: true,
	});
};
interface Props {
	match: any;
}

export const FulfillPreparationSlips = ({ match }: Props) => {
	const preparationSlipId = match?.params?.id;

	// STATES
	const [preparationSlip, setPreparationSlip] = useState(null);
	const [psProducts, setPsProducts] = useState({});
	const [data, setData] = useState([]);

	const [fulfillType, setFulfillType] = useState(null);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [selectedIndex, setSelectedProductIndex] = useState(0);

	const [isEdited, setIsEdited] = useState(false);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const { getPreparationSlipById, status: prepSlipStatus } =
		usePreparationSlips();
	const {
		fulfillPreparationSlip: fulfillPrepSlip,
		reset: fulfillPrepSlipReset,
		status: fulfillPrepSlipStatus,
		errors: fulfillPrepSlipErrors,
	} = usePreparationSlips();
	const {
		fulfillPreparationSlip: savePrepSlip,
		reset: savePrepSlipReset,
		status: savePrepSlipStatus,
		errors: savePrepSlipErrors,
	} = usePreparationSlips();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	useEffect(() => {
		getPreparationSlipById(
			{
				id: preparationSlipId,
				assignedPersonnelId: user?.id,
				requestingUserId: user.id,
			},
			({ status, data: psData }) => {
				if (status === request.SUCCESS) {
					// Save preparation slip
					setPreparationSlip(psData);

					// Save products
					const initialProducts = {};
					psData.products.forEach((psProduct) => {
						initialProducts[psProduct.id] = {
							// OS product details
							id: psProduct.id,
							ordered: psProduct.quantity_piece,
							fulfilled: psProduct.fulfilled_quantity_piece || 0,
							assignedPersonId: psProduct.assigned_person.id,

							// Product details
							productId: psProduct.product.id,
							name: psProduct.product.name,
							barcode: psProduct.product.barcode,
							textcode: psProduct.product.textcode,
							unitOfMeasurement: psProduct.product.unit_of_measurement,
						};
					});

					formatProducts(initialProducts, true);
				} else if (status === request.ERROR) {
					history.replace('/404');
				}
			},
		);
	}, []);

	useEffect(() => {
		window.addEventListener('beforeunload', alertUser);

		return () => {
			window.removeEventListener('beforeunload', alertUser);
		};
	}, [isEdited]);

	const alertUser = (e) => {
		if (isEdited) {
			e.preventDefault();
			e.returnValue = '';
		}
	};

	const formatProducts = (products, shouldSave = false) => {
		const productKeys = Object.keys(products).sort(
			(key1, key2) => products[key1].fulfilled - products[key2].fulfilled,
		);

		const formattedProducts = productKeys.map((key) => {
			const { ordered, fulfilled, name, unitOfMeasurement } = products[key];

			return [
				{
					isHidden: true,
					product: products[key],
				},
				<div className="FulfillPreparationSlip_productName">
					{fulfilled > 0 ? <CheckIcon /> : null}
					<span>{name}</span>
				</div>,
				formatQuantity(unitOfMeasurement, ordered),
				formatQuantity(unitOfMeasurement, fulfilled),
			];
		});

		setData(formattedProducts);

		if (shouldSave) {
			setPsProducts(products);
		}
	};

	const onSearch = useCallback(
		debounce((keyword) => {
			const lowerCaseKeyword = keyword.toLowerCase();

			const products = Object.keys(psProducts)
				.filter((key) => {
					const product = psProducts[key];

					const name = product.name?.toLowerCase() ?? '';
					const barcode = product.barcode?.toLowerCase() ?? '';
					const textcode = product.textcode?.toLowerCase() ?? '';

					return (
						name.includes(lowerCaseKeyword) ||
						barcode.includes(lowerCaseKeyword) ||
						textcode.includes(lowerCaseKeyword)
					);
				})
				.map((key) => psProducts[key]);

			formatProducts(products, false);
		}, SEARCH_DEBOUNCE_TIME),
		[psProducts],
	);

	const onShowFulfillSlipModal = (type) => {
		const product = data?.[selectedIndex]?.[0]?.product;

		if (product) {
			setFulfillType(type);
			setSelectedProduct(product);
		} else {
			message.error('Select a product first.');
		}
	};

	const onUpdate = (id, quantity) => {
		const newProducts = {
			...psProducts,
			[id]: {
				...psProducts[id],
				fulfilled: quantity,
			},
		};

		formatProducts(newProducts, true);

		if (!isEdited) {
			setIsEdited(true);
		}
	};

	const onFulfill = (isPrepared) => {
		if (!isEdited && !isPrepared) {
			message.warning('You have not made any adjustments yet.');
			return;
		}

		const mismatchProducts = [];

		const preparationSlipData = {
			id: preparationSlip.id,
			is_prepared: isPrepared,
			assigned_store_id: user.branch.id,
			is_online: IS_APP_LIVE,
			products: Object.keys(psProducts).map((key) => {
				const psProduct = psProducts[key];

				if (Number(psProduct.ordered) !== Number(psProduct.fulfilled)) {
					mismatchProducts.push(psProduct.name);
				}

				return {
					order_slip_product_id: psProduct.id,
					product_id: psProduct.productId,
					assigned_person_id: psProduct.assignedPersonId,
					quantity_piece: psProduct.ordered,
					fulfilled_quantity_piece: psProduct.fulfilled || 0,
				};
			}),
		};

		fulfillPrepSlipReset();
		savePrepSlipReset();

		if (isPrepared) {
			const fulfillFn = () => {
				fulfillPrepSlip(preparationSlipData, ({ status }) => {
					if (status === request.SUCCESS) {
						history.push('/branch-personnel/preparation-slips');
					}
				});
			};

			if (mismatchProducts.length > 0) {
				showConfirmation(fulfillFn, mismatchProducts);
			} else {
				fulfillFn();
			}
		} else {
			savePrepSlip(preparationSlipData);
		}

		setIsEdited(false);
	};

	const handleScan = (barcodeNumber) => {
		const barcode = toString(barcodeNumber);
		message.info({
			key: MESSAGE_KEY,
			content: `Scanned Barcode: ${barcodeNumber}`,
		});

		// Search for scanned product
		const barcodes = [barcode.substr(0, 7), barcode];
		const foundKey = Object.keys(psProducts).find((key) =>
			barcodes.includes(psProducts[key].barcode),
		);

		if (foundKey) {
			// Calculate quantity
			let quantity = 1;
			const product = psProducts[foundKey];

			// Extract the weighing quantity
			if (product.unitOfMeasurement === unitOfMeasurementTypes.WEIGHING) {
				const value = barcode.substr(-6);
				const whole = value.substr(0, 2);
				const decimal = value.substr(2, 4);
				quantity = Number(Number(`${whole}.${decimal}`).toFixed(3));
			}

			// Add quantity
			const newQuantity = product.fulfilled + quantity;
			message.success({
				key: MESSAGE_KEY_RESULT,
				content: `${product.name} successfully edited.`,
			});

			// Update
			onUpdate(foundKey, newQuantity);
		} else {
			// Product not found
			message.error({
				key: MESSAGE_KEY_RESULT,
				content: `Cannot find the scanned product: ${barcode}.`,
			});
		}
	};

	const handleError = (err) => {
		// eslint-disable-next-line no-console
		console.error(err);
	};

	const handleKeyDown = throttle((event) => {
		const key = getKeyDownCombination(event);

		if (key === 'ArrowUp') {
			setSelectedProductIndex((value) => {
				const newValue = value > 0 ? value - 1 : value;
				return newValue;
			});

			return;
		}

		if (key === 'ArrowDown') {
			setSelectedProductIndex((value) => {
				if (data?.length > 0) {
					const newValue = value < data.length - 1 ? value + 1 : value;
					return newValue;
				}
				return value;
			});

			return;
		}

		if (key === 'f1') {
			onShowFulfillSlipModal(FULFILL_TYPES.ADD);
			return;
		}

		if (key === 'f2') {
			onShowFulfillSlipModal(FULFILL_TYPES.DEDUCT);
		}
	}, 500);

	const getFetchLoadingText = useCallback(() => {
		let loadingText = '';

		if (prepSlipStatus === request.REQUESTING) {
			loadingText = 'Fetching preparation slip...';
		} else if (fulfillPrepSlipStatus === request.REQUESTING) {
			loadingText = 'Submitting preparation slip...';
		} else if (savePrepSlipStatus === request.REQUESTING) {
			loadingText = 'Saving preparation slip...';
		}

		return loadingText;
	}, [prepSlipStatus, fulfillPrepSlipStatus, savePrepSlipStatus]);

	return (
		<Content
			className="FulfillPreparationSlip"
			title="Fulfill Preparation Slip"
		>
			<BarcodeReader onError={handleError} onScan={handleScan} />
			<Spin
				size="large"
				tip={getFetchLoadingText()}
				spinning={[
					prepSlipStatus,
					fulfillPrepSlipStatus,
					savePrepSlipStatus,
				].includes(request.REQUESTING)}
			>
				<Box>
					<PreparationSlipDetails
						className="PaddingHorizontal PaddingVertical"
						preparationSlip={preparationSlip}
					/>

					<RequestErrors
						className="PaddingHorizontal"
						errors={[
							...convertIntoArray(fulfillPrepSlipErrors, 'Fulfill'),
							...convertIntoArray(savePrepSlipErrors, 'Saving'),
						]}
						withSpaceBottom
					/>

					<div className="FulfillPreparationSlip_keyboardKeys PaddingHorizontal">
						<KeyboardButton
							keyboardKey="F1"
							label="Add Quantity"
							onClick={() => onShowFulfillSlipModal(FULFILL_TYPES.ADD)}
						/>
						<KeyboardButton
							keyboardKey="F2"
							label="Deduct Quantity"
							onClick={() => onShowFulfillSlipModal(FULFILL_TYPES.DEDUCT)}
						/>
					</div>

					<div className="PaddingHorizontal PaddingVertical">
						<Label label="Search" spacing />
						<Input
							prefix={<SearchOutlined />}
							onChange={(event) => onSearch(event.target.value.trim())}
						/>
					</div>

					<TableNormal
						columns={columns}
						data={data}
						activeRow={selectedIndex}
						displayInPage
					/>

					{preparationSlip?.status !== preparationSlipStatus.COMPLETED && (
						<div className="FulfillPreparationSlip_btnActions PaddingHorizontal PaddingVertical">
							<Button
								text="Save"
								variant="secondary"
								onClick={() => onFulfill(false)}
							/>

							<Button
								classNames="FulfillPreparationSlip_btnActions_btnFulfill"
								text="Fulfill"
								variant="primary"
								onClick={() => onFulfill(true)}
							/>
						</div>
					)}
				</Box>
			</Spin>

			{fulfillType && (
				<FulfillSlipModal
					type={fulfillType}
					product={selectedProduct}
					onSubmit={onUpdate}
					onClose={() => setFulfillType(false)}
				/>
			)}
		</Content>
	);
};
