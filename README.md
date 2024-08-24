<h1>Use Pull To Refresh <a href=""><img alt="npm" src="https://img.shields.io/npm/v/use-pull-to-refresh?label="></a></h1>
<img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/use-pull-to-refresh">
<img alt="License" src="https://img.shields.io/npm/l/use-pull-to-refresh">
<img alt="is maintained" src="https://badgen.net/badge/maintained/yes/green">

## Table of contents

-  [Table of contents](#table-of-contents)
-  [Description](#description)
-  [Purposes](#purposes)
-  [Prerequisites](#prerequisites)
-  [Getting Started](#getting-started)
   -  [What's the different to other similar packages?](#whats-the-different-to-other-similar-packages)
-  [Installation](#installation)
-  [Usage](#usage)
-  [API](#api)
   -  [Parameters](#parameters)
   -  [Return Type](#return-type)
-  [Change log](#change-log)
-  [Authors](#authors)
-  [License](#license)

## Description

A simple React custom hook for pull-to-refresh function that support [NextJs](https://nextjs.org/) SSR.

## Purposes

Lots of web application needs custom scroll area for various reasons, however since we are not using browser native scroll,
the native pull to refresh API is unusable since it's tied to the scroll event on `html` tag. This hooks is the solution to
resolve this issue by recreating the native pull top behavior while also let you choose what proccess to run on each pull
event end.

## Prerequisites

This project requires NodeJS (version 16 or later) and React 17+

## Getting Started

This custom hook helps you implement the pull-to-refresh feature in your app. It supports NextJs SSR that some other packages don't. It also allows support of a custom Scroll Area that was created by yourself.

### What's the different to other similar packages?

-  [react-pull-to-refresh](https://www.npmjs.com/package/react-pull-to-refresh) : will run into error `'window' is not defined` when using with NextJs SSR.
-  [react-hooks-pull-to-refresh](https://www.npmjs.com/package/react-hooks-pull-to-refresh), [react-pull-updown-to-refresh](https://www.npmjs.com/package/react-pull-updown-to-refresh), [react-web-pull-to-refresh](https://www.npmjs.com/package/react-web-pull-to-refresh) : Either being unmaintained or doesn't support Typescript, or newer version of React.
-  [react-native-pull-refresh-android](https://www.npmjs.com/package/react-native-pull-refresh-android) : solution only available for react native.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

To install and set up the library, run:

```sh
$ npm i use-pull-to-refresh
```

Or if you prefer using Yarn:

```sh
$ yarn add use-pull-to-refresh
```

Or if you prefer using pnpm:

```sh
$ pnpm add use-pull-to-refresh
```

## Usage

### [NextJs](https://nextjs.org/) Example With [TailwindCSS](https://tailwindcss.com/)

```jsx
import { useRouter } from 'next/router';
import { usePullToRefresh } from 'use-pull-to-refresh';

const MAXIMUM_PULL_LENGTH = 240;
const REFRESH_THRESHOLD = 180;

export default function PageRefresh() {
	const { isReady, reload } = useRouter();

	const { isRefreshing, pullPosition } = usePullToRefresh({
		// you can choose what behavior for `onRefresh`, could be calling an API to load more data, or refresh whole page.
		onRefresh: reload,
		maximumPullLength: MAXIMUM_PULL_LENGTH,
		refreshThreshold: REFRESH_THRESHOLD,
		isDisabled: !isReady
	});

	return (
		<div
			style={{
				top: (isRefreshing ? REFRESH_THRESHOLD : pullPosition) / 3,
				opacity: isRefreshing || pullPosition > 0 ? 1 : 0
			}}
			className='bg-base-100 fixed inset-x-1/2 z-30 h-8 w-8 -translate-x-1/2 rounded-full p-2 shadow'
		>
			<div
				className={`h-full w-full ${isRefreshing ? 'animate-spin' : ''}`}
				style={!isRefreshing ? { transform: `rotate(${pullPosition}deg)` } : {}}
			>
				<AnySpinnerSVGIconComponentWorksHere className='h-full w-full' />
			</div>
		</div>
	);
}
```

## API

### Parameters

```typescript
type UsePullToRefreshParams = {
	onRefresh: () => void;
	maximumPullLength?: number;
	refreshThreshold?: number;
	isDisabled?: boolean;
};
```

-  `onRefresh` (**required**): refresh callback function run when pull event end.
-  `maximumPullLength`: limit how far the refresh icon was pulled down.
-  `refreshThreshold`: `pullPosition` that will trigger `onRefresh` function.
-  `isDisabled`: disabling pull function in case the `onRefresh` function is not ready to run.

### Return Type

```typescript
type UsePullToRefreshReturn = {
	isRefreshing: boolean;
	pullPosition: number;
};
```

-  `isRefreshing`: indicate refresh callback function is running.
-  `pullPosition`: current pull gesture position.

## Change Log

-  [Pleach check here](https://github.com/Senbonzakura1234/use-pull-to-refresh/blob/main/CHANGELOG.md)

## Authors

-  **Senbonzakura1234** - _Initial work_ - [Senbonzakura1234](https://github.com/Senbonzakura1234)

## License

[MIT License](https://github.com/Senbonzakura1234/use-pull-to-refresh/blob/main/LICENSE) © Senbonzakura1234
