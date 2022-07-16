import { Button, Spin, Tooltip } from 'antd';
import cn from 'classnames';
import dayjs from 'dayjs';
import { EMPTY_CELL } from 'global';
import {
	useAuth,
	useBranchesDayAuthorizationCreate,
	useBranchesDayAuthorizationEnd,
	useBranchesDayAuthorizationsRetrieve,
	useSiteSettingsRetrieve,
} from 'hooks';
import React, { useCallback } from 'react';
import swal from 'sweetalert';
import { convertIntoArray, formatDateTimeExtended } from 'utils';
import { RequestErrors } from '..';
import { Box } from '../elements';
import './style.scss';

interface Props {
	className?: string;
	bordered?: boolean;
}

export const CashieringCard = ({ className, bordered }: Props) => {
	// CUSTOM HOOKS
	const { user } = useAuth();
	const { data: siteSettings, isFetching: isFetchingSiteSettings } =
		useSiteSettingsRetrieve();
	const { data: branchDay, isFetching: isFetchingBranchDayAuthorization } =
		useBranchesDayAuthorizationsRetrieve();
	const {
		mutate: createBranchDayAuthorization,
		isLoading: isCreatingBranchDayAuthorization,
		error: createError,
	} = useBranchesDayAuthorizationCreate();
	const {
		mutate: endBranchDayAuthorization,
		isLoading: isEndingBranchDayAuthorization,
		error: endError,
	} = useBranchesDayAuthorizationEnd();

	// METHODS

	const isPastCloseDayDeadline = useCallback(() => {
		if (siteSettings) {
			const today = dayjs();
			const closeDayDeadline = dayjs(
				siteSettings.close_day_deadline,
				'hh:mm:ss',
			);

			return closeDayDeadline.diff(today, 'milliseconds') <= 0;
		}

		return null;
	}, [siteSettings]);

	const getTitle = useCallback(() => {
		if (branchDay?.datetime_ended) {
			return 'Day has been ended.';
		}

		if (branchDay) {
			return 'Day has been started.';
		}

		return EMPTY_CELL;
	}, [branchDay]);

	const getDate = useCallback(() => {
		if (branchDay?.datetime_ended) {
			return formatDateTimeExtended(branchDay?.datetime_ended);
		}

		if (branchDay) {
			return formatDateTimeExtended(branchDay?.datetime_created);
		}

		return null;
	}, [branchDay]);

	const handleClick = () => {
		swal({
			title: 'Confirmation',
			text: `Are you sure you want to ${branchDay ? 'Close Day' : 'Open Day'}?`,
			icon: 'warning',
			buttons: {
				cancel: {
					text: 'Cancel',
					value: null,
					visible: true,
					closeModal: true,
				},
				confirm: {
					text: 'OK',
					value: true,
					visible: true,
					closeModal: true,
				},
			},
		}).then((value) => {
			if (value) {
				if (branchDay) {
					endBranchDayAuthorization({ id: branchDay.id });
				} else {
					createBranchDayAuthorization({ startedById: user.id });
				}
			}
		});
	};

	return (
		<Box
			className={cn('CashieringCard', className, {
				CashieringCard__bordered: bordered,
			})}
		>
			<Spin
				spinning={
					isFetchingSiteSettings ||
					isFetchingBranchDayAuthorization ||
					isCreatingBranchDayAuthorization ||
					isEndingBranchDayAuthorization
				}
			>
				<div className="CashieringCard_container">
					<RequestErrors
						errors={[
							...convertIntoArray(createError?.errors),
							...convertIntoArray(endError?.errors),
						]}
						withSpaceBottom
					/>

					<div>
						<p className="CashieringCard_title">{getTitle()}</p>
						<span className="CashieringCard_date">{getDate()}</span>
					</div>
					{}
					{!branchDay?.datetime_ended && (
						<Tooltip
							title={
								isPastCloseDayDeadline()
									? 'Already past the close day deadline.'
									: null
							}
						>
							<Button
								type="primary"
								size="large"
								onClick={handleClick}
								disabled={isPastCloseDayDeadline()}
							>
								{branchDay ? 'Close Day' : 'Open Day'}
							</Button>
						</Tooltip>
					)}
				</div>
			</Spin>
		</Box>
	);
};

CashieringCard.defaultProps = {
	className: undefined,
	bordered: false,
	disabled: false,
	loading: false,
};
