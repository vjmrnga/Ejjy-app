import React from 'react';
import { BadgePill } from '../elements';

interface Props {
	classNames?: any;
}

export const AddedToOSBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Added to OS" variant="primary" />
);

export const NotAddedToOSBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Not Yet Added to OS" />
);

export const NewBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="New" variant="secondary" />
);

export const SeenBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="Seen" />
);

export const FOS1CreatedBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="F-OS1 Created" />
);

export const FOS1PreparedBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="F-OS1 Prepared" />
);

export const FDS1CreatedBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="F-DS1 Created" />
);

export const FDS1DoneBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="F-DS1 Done" variant="primary" />
);

export const FDS1ErrorBadgePill = ({ classNames }: Props) => (
	<BadgePill classNames={classNames} label="F-DS1 Error" variant="error" />
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
