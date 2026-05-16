import { useCallback, useEffect, useRef, useState } from 'react';

export const DEFAULT_MAXIMUM_PULL_LENGTH = 240;
export const DEFAULT_REFRESH_THRESHOLD = 180;

export type UsePullToRefreshParams<T extends HTMLElement> = {
	onRefresh?: () => void | Promise<void>;
	// default value is 240
	maximumPullLength?: number;
	// default value is 180
	refreshThreshold?: number;
	isDisabled?: boolean;
	elementRef?: React.RefObject<T | null>;
	enableDebug?: boolean;
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
	elementRef,
	enableDebug = false
}: UsePullToRefreshParams<T>): UsePullToRefreshReturn => {
	const [pullPosition, setPullPosition] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);

	// Use refs for internal tracking to prevent continuous re-rendering and listener re-attachment
	const pullStartRef = useRef(0);
	const pullPositionRef = useRef(0);
	const isRefreshingRef = useRef(false);

	// Sync state to ref for access inside event listeners without dependency arrays
	useEffect(() => {
		isRefreshingRef.current = isRefreshing;
	}, [isRefreshing]);

	const onPullStart = useCallback(
		(e: TouchEvent) => {
			if (isDisabled || isRefreshingRef.current) return;

			// Ensure we are at the top of the container before allowing a pull
			const scrollTop = elementRef?.current ? elementRef.current.scrollTop : window.scrollY;
			if (scrollTop > 0) return;

			const touch = e.targetTouches[0];
			if (touch) {
				pullStartRef.current = touch.screenY;
			}
		},
		[isDisabled, elementRef]
	);

	const onPulling = useCallback(
		(e: TouchEvent) => {
			if (isDisabled || isRefreshingRef.current || pullStartRef.current === 0) return;

			const touch = e.targetTouches[0];
			if (!touch) return;

			const currentPullLength = touch.screenY > pullStartRef.current ? touch.screenY - pullStartRef.current : 0;

			if (currentPullLength <= maximumPullLength) {
				pullPositionRef.current = currentPullLength;
				setPullPosition(currentPullLength);
			}
		},
		[isDisabled, maximumPullLength]
	);

	const onEndPull = useCallback(() => {
		if (isDisabled || isRefreshingRef.current || pullStartRef.current === 0) return;

		pullStartRef.current = 0;
		const finalPullPosition = pullPositionRef.current;

		// Reset position visually
		pullPositionRef.current = 0;
		setPullPosition(0);

		if (finalPullPosition < refreshThreshold) return;

		setIsRefreshing(true);

		try {
			const cb = onRefresh?.();

			// Safely check if the callback returned a Promise
			if (!cb || typeof (cb as Promise<void>).then !== 'function') {
				return void setIsRefreshing(false);
			}

			void (cb as Promise<void>).finally(() => setIsRefreshing(false));
		} catch (error) {
			console.error('Error during refresh:', error);
			setIsRefreshing(false);
		}
	}, [isDisabled, onRefresh, refreshThreshold]);

	useEffect(() => {
		if (isDisabled) return;

		const ac = new AbortController();
		const options: AddEventListenerOptions = { passive: true, signal: ac.signal };
		const target = elementRef?.current || globalThis?.window;

		if (target) {
			target.addEventListener('touchstart', onPullStart as EventListener, options);
			target.addEventListener('touchmove', onPulling as EventListener, options);
			target.addEventListener('touchend', onEndPull as EventListener, options);
		}

		// The AbortController signal cleanly removes all listeners attached with it
		return () => ac.abort();
	}, [isDisabled, elementRef, onPullStart, onPulling, onEndPull]);

	useEffect(() => {
		if (isValid(maximumPullLength, refreshThreshold) || !enableDebug || isDisabled) return;

		console.warn(
			'usePullToRefresh:',
			`'maximumPullLength' (${maximumPullLength}) should be greater than or equal to 'refreshThreshold' (${refreshThreshold}).`
		);
	}, [maximumPullLength, refreshThreshold, isDisabled, enableDebug]);

	return { isRefreshing, pullPosition };
};
