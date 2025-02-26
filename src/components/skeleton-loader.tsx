import type { FC } from "react";

const SkeletonLoader: FC = () => (
	<div className="w-full">
		<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
		<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5" />
		<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
		<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5" />
		<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5" />
		<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]" />
	</div>
);

export default SkeletonLoader;
