/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Col, Divider, Modal, Radio, Row, Select, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { Button, Label } from '../../../../../components/elements';
import { printOrderSlip } from '../../../../../configurePrinter';
import { quantityTypes } from '../../../../../global/types';
import { useAuth } from '../../../../../hooks/useAuth';
import { convertToBulk, getColoredText } from '../../../../../utils/function';
import { OrderSlipDetails } from './OrderSlipDetails';

const columns: ColumnsType = [
	{
		title: 'Barcode',
		dataIndex: 'barcode',
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
	const { user } = useAuth();

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
						product: { barcode, name, pieces_in_bulk },
						assigned_person: { first_name, last_name },
						quantity_piece,
						fulfilled_quantity_piece = 0,
					} = product;
					const fulfilledQuantityPiece = fulfilled_quantity_piece || 0;

					const isFulfilled = fulfilledQuantityPiece > 0;
					const inputted =
						quantityType === quantityTypes.PIECE
							? fulfilledQuantityPiece
							: convertToBulk(fulfilledQuantityPiece, pieces_in_bulk);
					const ordered =
						quantityType === quantityTypes.PIECE
							? quantity_piece
							: convertToBulk(quantity_piece, pieces_in_bulk);

					return {
						barcode,
						name,
						quantity: getColoredText(!isFulfilled, inputted, ordered),
						personnel: `${first_name} ${last_name}`,
						ordered,
					};
				});

			setData(orderSlipProducts);
		}
	}, [orderSlip, quantityType, personnel]);

	const onPrint = () => {
		setPrintingDisabled(true);

		const html = printOrderSlip(user, orderSlip, data, quantityType);
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
			title="View Order Slip"
			className="Modal__large Modal__hasFooter"
			footer={[
				<Space size={10}>
					<Button text="Close" onClick={onClose} />
					<Button
						variant="primary"
						text="Print"
						onClick={onPrint}
						loading={printingDisabled}
					/>
				</Space>,
			]}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<OrderSlipDetails orderSlip={orderSlip} />

			<Divider dashed />

			<Row gutter={[15, 15]}>
				<Col sm={12} span={24}>
					<Label label="Quantity Type" spacing />
					<Radio.Group
						options={[
							{ label: 'Piece', value: quantityTypes.PIECE },
							{ label: 'Bulk', value: quantityTypes.BULK },
						]}
						onChange={(e) => {
							const { value } = e.target;
							setQuantityType(value);
						}}
						defaultValue={quantityTypes.PIECE}
						optionType="button"
					/>
				</Col>

				<Col sm={12} span={24}>
					<Label label="Assigned Personnel" spacing />
					<Select
						style={{ width: '100%' }}
						onChange={(value) => {
							setPersonnel(value);
						}}
						allowClear
					>
						{personnels.map(({ id, first_name, last_name }) => (
							<Select.Option value={id}>
								{`${first_name} ${last_name}`}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col span={24}>
					<Table
						columns={columns}
						dataSource={data}
						scroll={{ x: 650, y: 250 }}
						pagination={false}
					/>
				</Col>
			</Row>
		</Modal>
	);
};
