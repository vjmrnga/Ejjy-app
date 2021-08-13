import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { ButtonLink } from '../../../../../components/elements';
import { formatDateTime } from '../../../../../utils/function';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id', key: 'id' },
	{
		title: 'Date & Time Created',
		dataIndex: 'datetime_created',
		key: 'datetime_created',
	},
];

interface Props {
	adjustmentSlips: any;
	onViewAdjustmentSlip: any;
	loading: boolean;
}

export const AdjustmentSlipsTable = ({
	adjustmentSlips,
	onViewAdjustmentSlip,
	loading,
}: Props) => {
	const [data, setData] = useState([]);

	// Effect: Format order slips to be rendered in Table
	useEffect(() => {
		if (adjustmentSlips) {
			setData(
				adjustmentSlips.map((adjustmentSlip) => {
					const { id, datetime_created } = adjustmentSlip;

					return {
						id: (
							<ButtonLink
								text={id}
								onClick={() => onViewAdjustmentSlip(adjustmentSlip)}
							/>
						),
						datetime_created: formatDateTime(datetime_created),
					};
				}),
			);
		}
	}, [adjustmentSlips, onViewAdjustmentSlip]);

	return (
		<Table
			columns={columns}
			dataSource={data}
			pagination={false}
			loading={loading}
		/>
	);
};
