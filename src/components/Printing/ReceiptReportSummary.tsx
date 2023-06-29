import React from 'react';

interface Props {
	data: any;
}

export const ReceiptReportSummary = ({ data }: Props) => (
	<table style={{ marginLeft: '50px' }}>
		{data.map((d) => (
			<tr key={d.value}>
				<td style={{ width: '100px' }}>{d.label}:</td>
				<td style={{ textAlign: 'right' }}>{d.value}</td>
			</tr>
		))}
	</table>
);
