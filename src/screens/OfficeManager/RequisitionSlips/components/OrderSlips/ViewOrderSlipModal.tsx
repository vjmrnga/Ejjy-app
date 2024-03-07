/* eslint-disable new-cap */

import { Col, Divider, Modal, Radio, Row, Select, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Button, Label } from 'components/elements';
import { filterOption, printOrderSlip } from 'ejjy-global';
import { quantityTypes } from 'global';
import { useSiteSettings } from 'hooks';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import { convertToBulk, formatQuantity, getColoredText } from 'utils';
import { OrderSlipDetails } from './OrderSlipDetails';

const columns: ColumnsType = [
	{
		title: 'Code',
		dataIndex: 'code',
		width: 150,
		fixed: 'left',
	},
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Quantity', dataIndex: 'quantity' },
	{ title: 'Personnel', dataIndex: 'personnel' },
];

interface Props {
	orderSlip: any;
	onClose: any;
}

export const ViewOrderSlipModal = ({ orderSlip, onClose }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [quantityType, setQuantityType] = useState(quantityTypes.PIECE);
	const [personnels, setPersonnels] = useState([]);
	const [personnel, setPersonnel] = useState(null);
	const [printingDisabled, setPrintingDisabled] = useState(false);

	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const { data: siteSettings } = useSiteSettings();

	// METHODS
	useEffect(() => {
		if (orderSlip) {
			const addedPersonnelIds = [];
			const listPersonnels = [];

			orderSlip.products.forEach(({ assigned_person }) => {
				if (!addedPersonnelIds.includes(assigned_person.id)) {
					listPersonnels.push(assigned_person);
					addedPersonnelIds.push(assigned_person.id);
				}
			});

			setPersonnels(listPersonnels);
		}
	}, [orderSlip]);

	useEffect(() => {
		if (orderSlip) {
			const orderSlipProducts = orderSlip.products
				?.filter(({ assigned_person }) => {
					if (personnel) {
						return assigned_person.id === personnel;
					}
					return true;
				})
				?.map((product) => {
					const {
						product: {
							barcode,
							textcode,
							name,
							pieces_in_bulk,
							unit_of_measurement,
						},
						assigned_person: { first_name, last_name },
						quantity_piece,
						fulfilled_quantity_piece = 0,
					} = product;
					const fulfilledQuantityPiece = fulfilled_quantity_piece || 0;

					const isFulfilled = fulfilledQuantityPiece > 0;
					const inputted =
						quantityType === quantityTypes.PIECE
							? formatQuantity({
									unitOfMeasurement: unit_of_measurement,
									quantity: fulfilledQuantityPiece,
							  })
							: convertToBulk(fulfilledQuantityPiece, pieces_in_bulk);
					const ordered =
						quantityType === quantityTypes.PIECE
							? formatQuantity({
									unitOfMeasurement: unit_of_measurement,
									quantity: quantity_piece,
							  })
							: convertToBulk(quantity_piece, pieces_in_bulk);

					return {
						code: barcode || textcode,
						name,
						quantity: getColoredText(!isFulfilled, inputted, ordered),
						personnel: `${first_name} ${last_name}`,
						ordered,
					};
				});

			setData(orderSlipProducts);
		}
	}, [orderSlip, quantityType, personnel]);

	const handlePrint = () => {
		setPrintingDisabled(true);

		const html = printOrderSlip(
			orderSlip,
			data,
			user,
			quantityType,
			siteSettings,
		);
		const pdf = new jsPDF('p', 'pt', 'a4');

		pdf.html(html, {
			x: 10,
			y: 10,
			filename: `FOS1_${orderSlip.id}`,
			callback: (instance) => {
				window.open(instance.output('bloburl').toString());
				setPrintingDisabled(false);
			},
		});
	};

	return (
		<Modal
			className="Modal__large Modal__hasFooter"
			footer={[
				<Space key="buttons" size={10}>
					<Button text="Close" onClick={onClose} />
					<Button
						loading={printingDisabled}
						text="Print"
						variant="primary"
						onClick={handlePrint}
					/>
				</Space>,
			]}
			title="View Order Slip"
			centered
			closable
			visible
			onCancel={onClose}
		>
			{orderSlip && <OrderSlipDetails orderSlip={orderSlip} />}

			<Divider dashed />

			<Row gutter={[16, 16]}>
				<Col sm={12} span={24}>
					<Label label="Quantity Type" spacing />
					<Radio.Group
						defaultValue={quantityTypes.PIECE}
						options={[
							{ label: 'Piece', value: quantityTypes.PIECE },
							{ label: 'Bulk', value: quantityTypes.BULK },
						]}
						optionType="button"
						onChange={(e) => {
							const { value } = e.target;
							setQuantityType(value);
						}}
					/>
				</Col>

				<Col sm={12} span={24}>
					<Label label="Assigned Personnel" spacing />
					<Select
						className="w-100"
						filterOption={filterOption}
						optionFilterProp="children"
						allowClear
						showSearch
						onChange={(value) => {
							setPersonnel(value);
						}}
					>
						{personnels.map(({ id, first_name, last_name }) => (
							<Select.Option key={id} value={id}>
								{`${first_name} ${last_name}`}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col span={24}>
					<Table
						columns={columns}
						dataSource={data}
						pagination={false}
						scroll={{ x: 650, y: 250 }}
						bordered
					/>
				</Col>
			</Row>
		</Modal>
	);
};
