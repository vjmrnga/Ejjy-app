import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import React, { useEffect, useState } from 'react';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id', key: 'id' },
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Type', dataIndex: 'type', key: 'type' },
	{ title: 'Action', dataIndex: 'action', key: 'action' },
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
			columns={columns}
			dataSource={data}
			scroll={{ x: 800 }}
			rowKey="key"
			pagination={false}
			bordered
		/>
	);
};
