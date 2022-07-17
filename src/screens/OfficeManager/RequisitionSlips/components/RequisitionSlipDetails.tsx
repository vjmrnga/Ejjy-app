import { Col, Row } from 'antd';
import cn from 'classnames';
import { upperFirst } from 'lodash';
import React, { useCallback } from 'react';
import { formatDateTime } from 'utils';
import { Label, Select } from '../../../../components/elements';
import { requisitionSlipActionsOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useRequisitionSlips } from '../../../../hooks/useRequisitionSlips';
import '../style.scss';

export const requisitionSlipDetailsType = {
	SINGLE_VIEW: 'single_view',
	CREATE_EDIT: 'create_edit',
};

interface Props {
	requisitionSlip: any;
	type: string;
	className?: string;
}

export const RequisitionSlipDetails = ({
	requisitionSlip,
	type,
	className,
}: Props) => {
	const { editRequisitionSlip, status: requisitionSlipsStatus } =
		useRequisitionSlips();

	const getRequestor = useCallback(() => {
		const {
			first_name = '',
			last_name = '',
			branch = {},
		} = requisitionSlip?.requesting_user || {};
		return `${first_name} ${last_name} - ${branch?.name || ''}`;
	}, [requisitionSlip]);

	const onStatusChange = (status) => {
		if (requisitionSlip) {
			editRequisitionSlip(requisitionSlip.id, status);
		}
	};

	return (
		<Row
			className={cn(className, {
				details: type === requisitionSlipDetailsType.SINGLE_VIEW,
			})}
		>
			<Col lg={12} span={24}>
				<Row align="middle" gutter={[16, 16]}>
					<Col span={12}>
						<Label label="Date &amp; Time Created" />
					</Col>
					<Col span={12}>
						<span>{formatDateTime(requisitionSlip?.datetime_created)}</span>
					</Col>
				</Row>
				<Row align="middle" gutter={[16, 16]}>
					<Col span={12}>
						<Label label="Requestor" />
					</Col>
					<Col span={12}>
						<span>{getRequestor()}</span>
					</Col>
				</Row>
				{type === requisitionSlipDetailsType.SINGLE_VIEW && (
					<Row align="middle" gutter={[16, 16]}>
						<Col span={12}>
							<Label label="Request Type" />
						</Col>
						<Col span={12}>
							<span>{upperFirst(requisitionSlip?.type)}</span>
						</Col>
					</Row>
				)}
			</Col>

			<Col lg={12} span={24}>
				{type === requisitionSlipDetailsType.SINGLE_VIEW && (
					<Row gutter={[16, 16]}>
						<Col span={12}>
							<Label label="Status" />
						</Col>
						<Col span={12}>
							<Select
								classNames="status-select"
								disabled={requisitionSlipsStatus === request.REQUESTING}
								options={requisitionSlipActionsOptions}
								placeholder="status"
								value={requisitionSlip?.action?.action}
								onChange={onStatusChange}
							/>
						</Col>
					</Row>
				)}

				{type === requisitionSlipDetailsType.CREATE_EDIT && (
					<Row align="middle" gutter={[16, 16]}>
						<Col span={12}>
							<Label label="F-RS1" />
						</Col>
						<Col span={12}>
							<span>{requisitionSlip?.id}</span>
						</Col>
					</Row>
				)}
			</Col>
		</Row>
	);
};
