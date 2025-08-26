import { useSearchParams } from 'next/navigation';

export const useQueryParams = () => {
	const searchParams = useSearchParams();

	// Convert URLSearchParams to object
	const searchParamsObject: Record<string, string> = {};

	// Iterate through all search params and add them to object
	searchParams.forEach((value, key) => {
		searchParamsObject[key] = value;
	});

	return searchParamsObject;
};
