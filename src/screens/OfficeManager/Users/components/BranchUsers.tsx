import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import React, { useEffect, useState } from 'react';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'action' },
];

interface Props {
	dataSource?: any;
}

export const BranchUsers = ({ dataSource }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// METHODS
	useEffect(() => {
		setData(dataSource);
	}, [dataSource]);

	return (
		<Table
			rowKey="key"
			columns={columns}
			dataSource={data}
			scroll={{ x: 650 }}
			pagination={false}
		/>
	);
};
