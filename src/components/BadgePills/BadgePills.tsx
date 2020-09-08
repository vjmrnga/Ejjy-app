import React from 'react';
import { BadgePill } from '../elements';

interface IBadgePillsProps {
	classNames?: any;
}

export const NewBadgePill = ({ classNames }: IBadgePillsProps) => (
	<BadgePill classNames={classNames} label="New" variant="secondary" />
);

export const SeenBadgePill = ({ classNames }: IBadgePillsProps) => (
	<BadgePill classNames={classNames} label="Seen" />
);

export const AddedToOrderBadgePill = ({ classNames }: IBadgePillsProps) => (
	<BadgePill classNames={classNames} label="Added to Order" />
);

export const OrderPreparedBadgePill = ({ classNames }: IBadgePillsProps) => (
	<BadgePill classNames={classNames} label="Order Prepared" />
);

export const DeliveringBadgePill = ({ classNames }: IBadgePillsProps) => (
	<BadgePill classNames={classNames} label="Delivering" variant="secondary" />
);

export const CompletedBadgePill = ({ classNames }: IBadgePillsProps) => (
	<BadgePill classNames={classNames} label="Completed" variant="primary" />
);

export const ErrorBadgePill = ({ classNames }: IBadgePillsProps) => (
	<BadgePill classNames={classNames} label="Error" variant="error" />
);

export const AvailableBadgePill = ({ classNames }: IBadgePillsProps) => (
	<BadgePill classNames={classNames} label="Available" variant="primary" />
);

export const ReorderBadgePill = ({ classNames }: IBadgePillsProps) => (
	<BadgePill classNames={classNames} label="Reorder" variant="secondary" />
);

export const OutOfStocksBadgePill = ({ classNames }: IBadgePillsProps) => (
	<BadgePill classNames={classNames} label="Out of Stocks" variant="error" />
);
