import React from 'react';
import { BadgePill } from '../elements';

interface Props {
	classNames?: any;
}

export const NewBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="New" variant="secondary" />
);

export const SeenBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Seen" />
);

export const AddedToOrderBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Added to Order" />
);

export const OrderPreparedBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Order Prepared" />
);

export const DeliveringBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Delivering" variant="secondary" />
);

export const CompletedBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Completed" variant="primary" />
);

export const ErrorBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Error" variant="error" />
);

export const AvailableBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Available" variant="primary" />
);

export const ReorderBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Reorder" variant="secondary" />
);

export const OutOfStocksBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Out of Stocks" variant="error" />
);
