import instance from '@/configs/instances';
import { useQuery } from '@tanstack/react-query';

interface BookCategory {
	id: string;
	name: string;
	parent_id?: string | null;
	parent?: {
		id: string;
		name: string;
	} | null;
	createdAt: string;
	updatedAt: string;
}

interface HierarchicalCategory {
	id: string;
	name: string;
	parent_id?: string | null;
	parent_name?: string | null;
	children: HierarchicalCategory[];
	createdAt: string;
	updatedAt: string;
}

interface HierarchicalCategoriesResponse {
	data: HierarchicalCategory[];
	meta: {
		total: number;
		message: string;
	};
}

// Function to transform flat categories to hierarchical structure
const transformToHierarchical = (
	categories: BookCategory[]
): HierarchicalCategory[] => {
	// Create a map for easy lookup
	const categoryMap = new Map<string, HierarchicalCategory>();

	// Convert all categories to hierarchical format
	categories.forEach((category) => {
		categoryMap.set(category.id, {
			id: category.id,
			name: category.name,
			parent_id: category.parent_id,
			parent_name: category.parent?.name || null,
			children: [],
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
		});
	});

	// Build hierarchical structure
	const rootCategories: HierarchicalCategory[] = [];

	categories.forEach((category) => {
		const categoryDto = categoryMap.get(category.id)!;

		if (!category.parent_id) {
			// This is a root category
			rootCategories.push(categoryDto);
		} else {
			// This is a child category, add to parent
			const parent = categoryMap.get(category.parent_id);
			if (parent) {
				parent.children = parent.children || [];
				parent.children.push(categoryDto);
			}
		}
	});

	// Sort children by name
	const sortChildren = (categories: HierarchicalCategory[]) => {
		categories.sort((a, b) => a.name.localeCompare(b.name));
		categories.forEach((category) => {
			if (category.children && category.children.length > 0) {
				sortChildren(category.children);
			}
		});
	};

	sortChildren(rootCategories);

	return rootCategories;
};

export const useHierarchicalCategories = () => {
	return useQuery<HierarchicalCategoriesResponse>({
		queryKey: ['hierarchical-categories'],
		queryFn: async () => {
			// Fetch all categories from existing API
			const response = await instance.get<BookCategory[]>(
				'/book-categories/all'
			);
			const categories = response.data;

			// Transform to hierarchical structure
			const hierarchicalData = transformToHierarchical(categories);

			return {
				data: hierarchicalData,
				meta: {
					total: categories.length,
					message: 'Danh sách thể loại theo cấu trúc phân cấp',
				},
			};
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
	});
};
