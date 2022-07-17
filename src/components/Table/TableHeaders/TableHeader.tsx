import cn from 'classnames';
import { debounce } from 'lodash';
import React, { useCallback } from 'react';
import { AddIcon } from '../..';
import { Button, SearchInput, Select } from '../../elements';
import { Option } from '../../elements/Select/Select';
import { PendingCount } from '../../PendingCount/PendingCount';
import './style.scss';

const SEARCH_DEBOUNCE_TIME_MS = 250;

interface Props {
	buttonName?: string;
	onCreate?: any;
	onCreateDisabled?: boolean;
	onCreateTooltip?: string;
	onSearch?: any;
	onStatusSelect?: any;
	pending?: number;
	searchDisabled?: boolean;
	searchPlaceholder?: string;
	statusDisabled?: boolean;
	statuses?: Option[];
	title?: string;
	wrapperClassName?: string;
}

export const TableHeader = ({
	buttonName,
	onCreate,
	onCreateDisabled,
	onCreateTooltip,
	onSearch,
	onStatusSelect,
	pending,
	searchDisabled,
	searchPlaceholder,
	statusDisabled,
	statuses,
	title,
	wrapperClassName,
}: Props) => {
	const debounceSearchedChange = useCallback(
		debounce((keyword) => onSearch(keyword), SEARCH_DEBOUNCE_TIME_MS),
		[onSearch],
	);

	return (
		<div className={cn('TableHeader', wrapperClassName)}>
			{title && <p className="title">{title}</p>}
			<div
				className={cn('controls', {
					'no-title': !title,
					'only-button': !title && !onSearch,
				})}
			>
				<div className="main-controls">
					{onSearch && (
						<SearchInput
							classNames="search-input"
							disabled={searchDisabled}
							placeholder={searchPlaceholder}
							onChange={(event) => {
								debounceSearchedChange(event.target.value.trim());
							}}
						/>
					)}

					{onStatusSelect && (
						<Select
							classNames="status-select"
							disabled={statusDisabled}
							options={statuses}
							placeholder="Status"
							onChange={onStatusSelect}
						/>
					)}
				</div>

				<div className="pending-button">
					{pending >= 0 && <PendingCount value={pending} />}

					{onCreate && (
						<Button
							disabled={onCreateDisabled}
							icon={<AddIcon />}
							iconDirection="left"
							text={buttonName}
							tooltip={onCreateTooltip}
							variant="primary"
							onClick={onCreate}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

TableHeader.defaultProps = {
	title: null,
	onSearch: null,
	onCreate: null,
	searchPlaceholder: 'Search',
};
