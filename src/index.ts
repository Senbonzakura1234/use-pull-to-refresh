import { useCallback, useEffect, useState } from 'react';

export const DEFAULT_MAXIMUM_PULL_LENGTH = 240;
export const DEFAULT_REFRESH_THRESHOLD = 180;

export type UsePullToRefreshParams<T extends HTMLElement> = {
	onRefresh: () => void | Promise<void>;
	// default value is 240
	maximumPullLength?: number;
	// default value is 180
	refreshThreshold?: number;
	isDisabled?: boolean;
	elementRef?: React.RefObject<T>;
};
export type UsePullToRefreshReturn = {
	isRefreshing: boolean;
	pullPosition: number;
};
export type UsePullToRefresh = typeof usePullToRefresh;

const isValid = (maximumPullLength: number, refreshThreshold: number) => maximumPullLength >= refreshThreshold;

export const usePullToRefresh = <T extends HTMLElement>({
	onRefresh,
	maximumPullLength = DEFAULT_MAXIMUM_PULL_LENGTH,
	refreshThreshold = DEFAULT_REFRESH_THRESHOLD,
	isDisabled = false,
	elementRef
}: UsePullToRefreshParams<T>) => {
	const [pullStartPosition, setPullStartPosition] = useState(0);
	const [pullPosition, setPullPosition] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const onPullStart = useCallback(
		({ targetTouches }: TouchEvent) => {
			if (isDisabled) return;

			const touch = targetTouches[0];

			if (touch) setPullStartPosition(touch.screenY);
		},
		[isDisabled]
	);

	const onPulling = useCallback(
		({ targetTouches }: TouchEvent) => {
			if (isDisabled) return;

			const touch = targetTouches[0];

			if (!touch) return;

			const currentPullLength = pullStartPosition < touch.screenY ? Math.abs(touch.screenY - pullStartPosition) : 0;

			const elementHeight = elementRef?.current?.offsetHeight || globalThis?.window?.screen.height || 0;

			if (currentPullLength <= maximumPullLength && pullStartPosition < elementHeight / 3) {
				setPullPosition(() => currentPullLength);
			}
		},
		[elementRef, isDisabled, maximumPullLength, pullStartPosition]
	);

	const onEndPull = useCallback(() => {
		if (isDisabled) return;

		setPullStartPosition(0);
		setPullPosition(0);

		if (pullPosition < refreshThreshold) return;

		setIsRefreshing(true);
		setTimeout(() => {
			const cb = onRefresh();

			if (typeof cb === 'object') return void cb.finally(() => setIsRefreshing(false));

			setIsRefreshing(false);
		}, 500);
	}, [isDisabled, onRefresh, pullPosition, refreshThreshold]);

	useEffect(() => {
		if (isDisabled) return;

		const ac = new AbortController();

		const options = {
			passive: true,
			signal: ac.signal
		};

		const element = elementRef?.current;

		if (element) {
			element.addEventListener('touchstart', onPullStart, options);
			element.addEventListener('touchmove', onPulling, options);
			element.addEventListener('touchend', onEndPull, options);

			return () => {
				element.removeEventListener('touchstart', onPullStart);
				element.removeEventListener('touchmove', onPulling);
				element.removeEventListener('touchend', onEndPull);
			};
		}

		if (typeof globalThis?.window === 'undefined') return;

		globalThis?.window?.addEventListener('touchstart', onPullStart, options);
		globalThis?.window?.addEventListener('touchmove', onPulling, options);
		globalThis?.window?.addEventListener('touchend', onEndPull, options);

		return () => void ac.abort();
	}, [elementRef, isDisabled, onEndPull, onPullStart, onPulling]);

	useEffect(() => {
		if (isValid(maximumPullLength, refreshThreshold) || process.env.NODE_ENV === 'production' || isDisabled) return;

		console.warn(
			'usePullToRefresh',
			`'maximumPullLength' (currently ${maximumPullLength})  should be bigger or equal than 'refreshThreshold' (currently ${refreshThreshold})`
		);
	}, [maximumPullLength, refreshThreshold, isDisabled]);

	return { isRefreshing, pullPosition };
};
