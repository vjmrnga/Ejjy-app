import adjustmentSlipsSagas from './adjustment-slips';
import backOrderAdjustmentSlipsSagas from './back-order-adjustment-slips';
import deliveryReceiptProducsSagas from './delivery-receipt-producs';
import deliveryReceiptsSagas from './delivery-receipts';
import orderSlipAdjustmentSlipsSagas from './order-slip-adjustment-slips';
import pendingTransactionsSagas from './pending-transactions';
import preparationSlipsSagas from './preparation-slips';
import returnItemSlipAdjustmentSlipsSagas from './return-item-slip-adjustment-slips';

export const officeManagerSagas = [
	...adjustmentSlipsSagas,
	...backOrderAdjustmentSlipsSagas,
	...deliveryReceiptProducsSagas,
	...deliveryReceiptsSagas,
	...orderSlipAdjustmentSlipsSagas,
	...pendingTransactionsSagas,
	...preparationSlipsSagas,
	...returnItemSlipAdjustmentSlipsSagas,
];
