import { useCallback, useEffect, useState } from "react";

export const DEFAULT_MAXIMUM_PULL_LENGTH = 240 as const;
export const DEFAULT_REFRESH_THRESHOLD = 180 as const;

export type UsePullToRefreshParams = {
	onRefresh: () => void;
	// default value is 240
	maximumPullLength?: number;
	// default value is 180
	refreshThreshold?: number;
};
export type UsePullToRefreshReturn = {
	isRefreshing: boolean;
	pullPosition: number;
};
export type UsePullToRefresh = ({
	onRefresh,
}: UsePullToRefreshParams) => UsePullToRefreshReturn;

const isValid = (maximumPullLength: number, refreshThreshold: number) => maximumPullLength >= refreshThreshold;

export const usePullToRefresh: UsePullToRefresh = ({
	onRefresh,
	maximumPullLength = DEFAULT_MAXIMUM_PULL_LENGTH,
	refreshThreshold = DEFAULT_REFRESH_THRESHOLD,
}) => {
	const [pullStartPosition, setPullStartPosition] = useState(0);
	const [pullPosition, setPullPosition] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const onPullStart = useCallback(({ targetTouches }: TouchEvent) => {
		const touch = targetTouches[0];

		if (touch) return setPullStartPosition(touch.screenY);
	}, []);

	const onPulling = useCallback(
		({ targetTouches }: TouchEvent) => {
			const touch = targetTouches[0];

			if (!touch) return;

			const currentPullLength =
				pullStartPosition < touch.screenY
					? Math.abs(touch.screenY - pullStartPosition)
					: 0;

			if (currentPullLength <= maximumPullLength)
				return setPullPosition(() => currentPullLength);
		},
		[pullStartPosition]
	);

	const onEndPull = useCallback(() => {
		setPullStartPosition(() => 0);
		setPullPosition(() => 0);

		if (pullPosition < refreshThreshold) return;

		setIsRefreshing(() => true);
		setTimeout(onRefresh);
	}, [onRefresh, pullPosition]);

	useEffect(() => {
		if (typeof window === "undefined") return;

		window.addEventListener("touchstart", onPullStart);
		window.addEventListener("touchmove", onPulling);
		window.addEventListener("touchend", onEndPull);

		return () => {
			window.removeEventListener("touchstart", onPullStart);
			window.removeEventListener("touchmove", onPulling);
			window.removeEventListener("touchend", onEndPull);
		};
	}, [onEndPull, onPulling, onPullStart]);

	useEffect(() => {
		if (isValid(maximumPullLength, refreshThreshold)) return;
		console.warn(
			"'maximumPullLength' should be bigger or equal than 'refreshThreshold'"
		);
	}, [maximumPullLength, refreshThreshold]);

	return { isRefreshing, pullPosition };
};
