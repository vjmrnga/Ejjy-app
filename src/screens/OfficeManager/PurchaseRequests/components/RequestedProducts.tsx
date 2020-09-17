import { Col, Divider, Row } from 'antd';
import { upperFirst } from 'lodash';
import React from 'react';
import { Table } from '../../../../components';
import { Box, Label, Select } from '../../../../components/elements';
import { purchaseRequestActionsOptions } from '../../../../global/variables';
import { calculateTableHeight, formatDateTime } from '../../../../utils/function';
import '../style.scss';

interface Props {
	datetimeCreated: string;
	requestor: string;
	type: string;
	action: string;
	onStatusChange: any;
	columns: any;
	data: any;
}

export const RequestedProducts = ({
	datetimeCreated,
	requestor,
	type,
	action,
	onStatusChange,
	columns,
	data,
}: Props) => (
	<Box>
		<Row className="details">
			<Col span={24} lg={12}>
				<Row gutter={[15, 15]} align="middle">
					<Col span={12}>
						<Label label="Date &amp; Time Created" />
					</Col>
					<Col span={12}>
						<strong>{formatDateTime(datetimeCreated)}</strong>
					</Col>
				</Row>
				<Row gutter={[15, 15]} align="middle">
					<Col span={12}>
						<Label label="Requestor" />
					</Col>
					<Col span={12}>
						<strong>{requestor}</strong>
					</Col>
				</Row>
				<Row gutter={[15, 15]} align="middle">
					<Col span={12}>
						<Label label="Request Type" />
					</Col>
					<Col span={12}>
						<strong>{upperFirst(type)}</strong>
					</Col>
				</Row>
			</Col>

			<Col span={24} lg={12}>
				<Row gutter={[15, 15]}>
					<Col span={12}>
						<Label label="Status" />
					</Col>
					<Col span={12}>
						<Select
							classNames="status-select"
							options={purchaseRequestActionsOptions}
							placeholder="status"
							defaultValue={action}
							onChange={(event) => onStatusChange(event.target.value)}
						/>
					</Col>
				</Row>
			</Col>
		</Row>

		<div className="requested-products">
			<Divider dashed />
			<Row gutter={[15, 15]} align="middle">
				<Col span={24}>
					<Label label="Requested Products" />
				</Col>
			</Row>
		</div>

		<Table
			columns={columns}
			dataSource={data}
			scroll={{ y: calculateTableHeight(data.length), x: '100vw' }}
			hasCustomHeaderComponent
		/>
	</Box>
);
