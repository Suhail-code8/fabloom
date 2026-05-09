'use client';

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    type ReactNode,
} from 'react';
import type { IReadymadeProduct, ReadymadeFilters, SizeKey } from '@/types/product';

// ============================================================================
// DEFAULTS
// ============================================================================

const DEFAULT_FILTERS: ReadymadeFilters = {
    sizes: [],
    priceMin: 0,
    priceMax: 5000,
    inStockOnly: false,
    sortBy: 'latest',
};

// ============================================================================
// CONTEXT SHAPE
// ============================================================================

interface FilterContextValue {
    filters: ReadymadeFilters;
    setFilters: (f: Partial<ReadymadeFilters>) => void;
    resetFilters: () => void;
    applyToProducts: (products: IReadymadeProduct[]) => IReadymadeProduct[];
    activeFilterCount: number;
}

const FilterContext = createContext<FilterContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export function ReadymadeFilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFiltersState] = useState<ReadymadeFilters>(DEFAULT_FILTERS);

    const setFilters = useCallback((partial: Partial<ReadymadeFilters>) => {
        setFiltersState((prev) => ({ ...prev, ...partial }));
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState(DEFAULT_FILTERS);
    }, []);

    // Count active non-default filters for the badge on the filter button
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.sizes.length > 0) count++;
        if (filters.priceMin > DEFAULT_FILTERS.priceMin) count++;
        if (filters.priceMax < DEFAULT_FILTERS.priceMax) count++;
        if (filters.inStockOnly) count++;
        if (filters.sortBy !== 'latest') count++;
        return count;
    }, [filters]);

    // Pure function — takes server data, returns client-filtered + sorted slice
    const applyToProducts = useCallback(
        (products: IReadymadeProduct[]): IReadymadeProduct[] => {
            let result = [...products];

            // Size filter — product must have stock > 0 for ANY selected size
            if (filters.sizes.length > 0) {
                result = result.filter((p) =>
                    filters.sizes.some((size) => (p.sizeStock[size] ?? 0) > 0)
                );
            }

            // Price range
            result = result.filter(
                (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
            );

            // In-stock only — at least one size has stock > 0
            if (filters.inStockOnly) {
                result = result.filter((p) =>
                    Object.values(p.sizeStock).some((qty) => qty > 0)
                );
            }

            // Sort
            switch (filters.sortBy) {
                case 'price-asc':
                    result.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    result.sort((a, b) => b.price - a.price);
                    break;
                case 'latest':
                default:
                    result.sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    );
            }

            return result;
        },
        [filters]
    );

    return (
        <FilterContext.Provider
            value={{ filters, setFilters, resetFilters, applyToProducts, activeFilterCount }}
        >
            {children}
        </FilterContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useReadymadeFilters(): FilterContextValue {
    const ctx = useContext(FilterContext);
    if (!ctx) throw new Error('useReadymadeFilters must be used inside ReadymadeFilterProvider');
    return ctx;
}

export type { SizeKey };
