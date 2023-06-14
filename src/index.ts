import { useCallback, useEffect, useState } from 'react';

export const DEFAULT_MAXIMUM_PULL_LENGTH = 240;
export const DEFAULT_REFRESH_THRESHOLD = 180;

export type UsePullToRefreshParams = {
	onRefresh: () => void;
	// default value is 240
	maximumPullLength?: number;
	// default value is 180
	refreshThreshold?: number;
	isDisabled?: boolean;
};
export type UsePullToRefreshReturn = {
	isRefreshing: boolean;
	pullPosition: number;
};
export type UsePullToRefresh = (params: UsePullToRefreshParams) => UsePullToRefreshReturn;

const isValid = (maximumPullLength: number, refreshThreshold: number) => maximumPullLength >= refreshThreshold;

export const usePullToRefresh: UsePullToRefresh = ({
	onRefresh,
	maximumPullLength = DEFAULT_MAXIMUM_PULL_LENGTH,
	refreshThreshold = DEFAULT_REFRESH_THRESHOLD,
	isDisabled = false,
}) => {
	const [pullStartPosition, setPullStartPosition] = useState(0);
	const [pullPosition, setPullPosition] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const onPullStart = useCallback(
		({ targetTouches }: TouchEvent) => {
			if (isDisabled) return;

			const touch = targetTouches[0];

			if (touch) setPullStartPosition(touch.screenY);
		},
		[isDisabled],
	);

	const onPulling = useCallback(
		({ targetTouches }: TouchEvent) => {
			if (isDisabled) return;

			const touch = targetTouches[0];

			if (!touch) return;

			const currentPullLength = pullStartPosition < touch.screenY ? Math.abs(touch.screenY - pullStartPosition) : 0;

			if (currentPullLength <= maximumPullLength) setPullPosition(() => currentPullLength);
		},
		[isDisabled, maximumPullLength, pullStartPosition],
	);

	const onEndPull = useCallback(() => {
		if (isDisabled) return;

		setPullStartPosition(0);
		setPullPosition(0);

		if (pullPosition < refreshThreshold) return;

		setIsRefreshing(() => true);
		setTimeout(onRefresh);
	}, [isDisabled, onRefresh, pullPosition, refreshThreshold]);

	useEffect(() => {
		if (typeof window === 'undefined' || isDisabled) return;

		window.addEventListener('touchstart', onPullStart);
		window.addEventListener('touchmove', onPulling);
		window.addEventListener('touchend', onEndPull);

		return () => {
			window.removeEventListener('touchstart', onPullStart);
			window.removeEventListener('touchmove', onPulling);
			window.removeEventListener('touchend', onEndPull);
		};
	}, [onEndPull, onPulling, onPullStart, isDisabled]);

	useEffect(() => {
		if (isValid(maximumPullLength, refreshThreshold) || process.env.NODE_ENV === 'production' || isDisabled) return;
		console.error(
			'usePullToRefresh',
			`'maximumPullLength' (currently ${maximumPullLength})  should be bigger or equal than 'refreshThreshold' (currently ${refreshThreshold})`,
		);
	}, [maximumPullLength, refreshThreshold, isDisabled]);

	return { isRefreshing, pullPosition };
};
