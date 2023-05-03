<h1>Use Pull To Refresh <a href=""><img alt="npm" src="https://img.shields.io/npm/v/use-pull-to-refresh?label="></a></h1>
<img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/use-pull-to-refresh">
<img alt="License" src="https://img.shields.io/npm/l/use-pull-to-refresh">
<img alt="is maintained" src="https://badgen.net/badge/maintained/yes/green">

## Table of contents

-  [Table of contents](#table-of-contents)
-  [Description](#description)
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

A simple React custom hook for pull-to-refresh function that support [NexJs](https://nextjs.org/) SSR.

## Prerequisites

This project requires NodeJS (version 16 or later) and React 17+

## Getting Started

This custom hooks helps you implement pull-to-refresh feature to your app, it support NextJs SSR that some other package didn't. It also allows support custom Scroll Area that was create by yourself.

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

### [NexJs](https://nextjs.org/) Example With [TailwindCSS](https://tailwindcss.com/)

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
		isDisabled: !isReady,
	});

	return (
		<div
			style={{
				top: (isRefreshing ? REFRESH_THRESHOLD : pullPosition) / 3,
				opacity: isRefreshing || pullPosition > 0 ? 1 : 0,
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

### 2.0.0

#### Major Changes

-  0af3a51: Implement eslint, fix bugs exposed by eslint.

### 1.4.0

#### Minor Changes

-  d126a81: Update readme and package's keywords

### 1.3.0

#### Minor Changes

-  2587d43: Move @types/node to devDependencies

### 1.2.0

#### Minor Changes

-  f8dac94: Add isDisabled param in case need to disable pull to refresh.

### 1.1.1

#### Patch Changes

-  90660a8: Make error messgae more clear, supress error message on production env

### 1.1.0

#### Minor Changes

-  9d974e6: Add custom maximumPullLength and refreshThreshold

## Authors

-  **Senbonzakura1234** - _Initial work_ - [Senbonzakura1234](https://github.com/Senbonzakura1234)

## License

[MIT License](https://github.com/Senbonzakura1234/use-pull-to-refresh/blob/main/LICENSE) © Senbonzakura1234
