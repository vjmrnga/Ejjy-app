import { saleTypes } from 'global';

export const ModeOfPayment = ({ modeOfPayment }) => {
	let component = null;

	if (modeOfPayment === saleTypes.CASH) {
		component = 'Cash';
	} else if (modeOfPayment === saleTypes.CREDIT) {
		component = 'Charge';
	}

	return component;
};
