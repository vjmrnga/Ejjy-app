import { Alert, Col, Input, Radio, Row, Select } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { appTypes, serviceTypes } from 'global';
import { useBranches } from 'hooks';
import qz from 'qz-tray';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { filterOption } from 'utils';
import * as Yup from 'yup';
import { Button, FieldError, Label } from '../../elements';

interface Props {
	appType: string;
	branchId: string;
	localApiUrl: string;
	onlineApiUrl: string;
	printerName: string;
	onSubmit: any;
	onClose: any;
}

export const AppSettingsForm = ({
	appType,
	branchId,
	localApiUrl,
	onlineApiUrl,
	printerName,
	onSubmit,
	onClose,
}: Props) => {
	// STATES
	const [baseURL, setBaseURL] = useState(onlineApiUrl || localApiUrl);
	const [printers, setPrinters] = useState([]);
	const [isFetchingPrinters, setIsFetchingPrinters] = useState(false);
	const [isPrintersFetched, setIsPrintersFetched] = useState(false);

	// REFS
	const formRef = useRef(null);

	// CUSTOM HOOKS
	const {
		data: { branches },
		isFetching: isFetchingBranches,
	} = useBranches({
		params: {
			baseURL,
			serviceType: serviceTypes.NORMAL,
		},
	});

	// METHODS
	useEffect(() => {
		if (isPrintersFetched) {
			return;
		}

		if (!qz.websocket.isActive()) {
			formRef.current.setStatus({
				error: {
					printerName: 'Cannot connect to QZTray.',
				},
			});
			return;
		}

		setIsFetchingPrinters(true);

		qz.printers
			.find()
			.then((data) => {
				setIsPrintersFetched(true);
				setPrinters(data);
			})
			.catch(() => {
				formRef.current.setStatus({
					error: {
						printerName: 'Unable to list printers.',
					},
				});
			})
			.finally(() => {
				setIsFetchingPrinters(false);
			});
	}, [formRef.current, isPrintersFetched]);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				appType: appType || appTypes.BACK_OFFICE,
				branchId: branchId || '',
				localApiUrl: localApiUrl || '',
				onlineApiUrl: onlineApiUrl || '',
				printerName: printerName || '',
			},
			Schema: Yup.object().shape({
				appType: Yup.string().label('App Type'),
				branchId: Yup.string().label('Branch'),
				localApiUrl: Yup.string().required().label('Local API URL'),
				onlineApiUrl: Yup.string().required().label('Online API URL'),
				printerName: Yup.string().label('Printer Name'),
			}),
		}),
		[appType, branchId, localApiUrl, onlineApiUrl, printerName],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			innerRef={formRef}
			validationSchema={getFormDetails().Schema}
			enableReinitialize
			onSubmit={(values) => {
				onSubmit(values);
			}}
		>
			{({ status, values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="Local API URL" spacing />
							<Input
								name="localApiUrl"
								size="large"
								value={values['localApiUrl']}
								onChange={(e) => {
									setFieldValue('localApiUrl', e.target.value);
								}}
							/>
							<ErrorMessage
								name="localApiUrl"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Online API URL" spacing />
							<Input
								name="onlineApiUrl"
								size="large"
								value={values['onlineApiUrl']}
								onBlur={(e) => {
									setBaseURL(e.target.value);
								}}
								onChange={(e) => {
									setFieldValue('onlineApiUrl', e.target.value);
								}}
								onFocus={(e) => {
									setBaseURL(e.target.value);
								}}
							/>
							<ErrorMessage
								name="onlineApiUrl"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Branch" spacing />
							<Select
								allowClear={false}
								className="w-100"
								filterOption={filterOption}
								loading={isFetchingBranches}
								optionFilterProp="children"
								size="large"
								value={values.branchId ? Number(values.branchId) : undefined}
								showSearch
								onChange={(value) => {
									setFieldValue('branchId', value);
								}}
							>
								{branches.map((branch) => (
									<Select.Option key={branch.id} value={branch.id}>
										{branch.name}
									</Select.Option>
								))}
							</Select>
							<ErrorMessage
								name="branchId"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label id="printerName" label="Printer Name" spacing />
							<Select
								className="w-100"
								disabled={status?.error?.printerName}
								filterOption={filterOption}
								loading={isFetchingPrinters}
								optionFilterProp="children"
								size="large"
								value={values.printerName}
								allowClear
								showSearch
								onChange={(value) => {
									setFieldValue('printerName', value);
								}}
							>
								{printers.map((printer) => (
									<Select.Option key={printer} value={printer}>
										{printer}
									</Select.Option>
								))}
							</Select>
							<ErrorMessage
								name="printerName"
								render={(error) => <FieldError error={error} />}
							/>
							{status?.error?.printerName && (
								<FieldError error={status.error.printerName} />
							)}
						</Col>

						<Col span={24}>
							<Label id="appType" label="App Type" spacing />

							<Radio.Group
								buttonStyle="solid"
								options={[
									{ label: 'Back Office', value: appTypes.BACK_OFFICE },
									{
										label: 'Head Office',
										value: appTypes.HEAD_OFFICE,
									},
								]}
								optionType="button"
								size="large"
								value={values.appType}
								onChange={(e) => {
									setFieldValue('appType', e.target.value);
								}}
							/>

							{values.appType !== appType && (
								<Alert
									className="mt-1"
									message="App will relaunch after saving app settings."
									type="info"
									showIcon
								/>
							)}

							<ErrorMessage
								name="appType"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button text="Cancel" type="button" onClick={onClose} />
						<Button text="Submit" type="submit" variant="primary" />
					</div>
				</Form>
			)}
		</Formik>
	);
};
