import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export type StitchingDetails = {
    style: string;
    measurements: Record<string, number>;
    notes?: string;
};

export type ReadymadeCartItem = {
    id: string;
    itemType: 'readymade';
    productId: string;
    name: string;
    image: string;
    size: string;
    quantity: number;
    price: number;
};

export type StitchingCartItem = {
    id: string;
    itemType: 'stitching';
    fabricId: string;
    fabricName: string;
    fabricImage: string;
    meters: number;
    pricePerMeter: number;
    garmentType: string;
    stitchingCharge: number;
    measurementProfileId: string;
    measurementProfileName: string;
    measurementSnapshot: Record<string, number>;
    totalPrice: number;
};

export type AccessoryCartItem = {
    id: string;
    itemType: 'accessory';
    productId: string;
    name: string;
    image: string;
    color?: string;
    quantity: number;
    price: number;
};

export type FabricCartItem = {
    id: string;
    itemType: 'fabric';
    productId: string;
    name: string;
    image: string;
    meters: number;
    pricePerMeter: number;
    fabricType: string;
    quantity: number;
    stitchingDetails?: StitchingDetails;
    stitchingPrice?: number;
};

export type CartItem = ReadymadeCartItem | StitchingCartItem | AccessoryCartItem | FabricCartItem;

// ============================================================================
// HELPERS
// ============================================================================

function computeTotalItems(items: CartItem[]): number {
    return items.reduce((total, item) => {
        if (item.itemType === 'stitching') return total + 1;
        return total + item.quantity;
    }, 0);
}

function computeTotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
        if (item.itemType === 'stitching') return total + item.totalPrice;
        if (item.itemType === 'fabric') {
            const fabricCost = item.pricePerMeter * item.meters;
            const stitchingCost = item.stitchingPrice || 0;
            return total + (fabricCost + stitchingCost) * item.quantity;
        }
        return total + item.price * item.quantity;
    }, 0);
}

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface CartStore {
    items: CartItem[];
    totalItems: number;   // ← reactive count for badges
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
    syncWithServer: (userId: string) => Promise<void>;
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,

            addItem: (newItem) => {
                const items = get().items;

                // Generate deterministic ID
                let id = '';
                if (newItem.itemType === 'readymade') {
                    id = `readymade-${(newItem as any).productId}-${(newItem as any).size}`;
                } else if (newItem.itemType === 'accessory') {
                    id = `accessory-${(newItem as any).productId}-${(newItem as any).color || 'none'}`;
                } else if (newItem.itemType === 'stitching') {
                    id = `stitching-${Date.now()}`;
                } else if (newItem.itemType === 'fabric') {
                    id = `fabric-${(newItem as any).productId}-${(newItem as any).meters}-${(newItem as any).stitchingDetails ? 'stitched' : 'raw'}`;
                }

                // Merge if same deterministic ID (not stitching)
                if (newItem.itemType !== 'stitching') {
                    const existingIdx = items.findIndex(i => i.id === id);
                    if (existingIdx > -1) {
                        const updated = [...items];
                        const existingItem = updated[existingIdx];
                        if (existingItem.itemType !== 'stitching') {
                            existingItem.quantity += (newItem as any).quantity;
                        }
                        set({ items: updated, totalItems: computeTotalItems(updated) });
                        return;
                    }
                }

                const updated = [...items, { ...newItem, id } as CartItem];
                set({ items: updated, totalItems: computeTotalItems(updated) });
            },

            removeItem: (itemId) => {
                const updated = get().items.filter(i => i.id !== itemId);
                set({ items: updated, totalItems: computeTotalItems(updated) });
            },

            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }
                const updated = get().items.map(item =>
                    item.id === itemId && item.itemType !== 'stitching'
                        ? { ...item, quantity }
                        : item
                );
                set({ items: updated, totalItems: computeTotalItems(updated) });
            },

            clearCart: () => set({ items: [], totalItems: 0 }),

            getTotal: () => computeTotal(get().items),

            getItemCount: () => computeTotalItems(get().items),

            syncWithServer: async (userId) => {
                try {
                    const items = get().items;
                    const res = await fetch('/api/cart/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, items }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.mergedItems) {
                            const merged = data.mergedItems;
                            set({ items: merged, totalItems: computeTotalItems(merged) });
                        }
                    }
                } catch (err) {
                    console.error('Failed to sync cart with server', err);
                }
            },
        }),
        {
            name: 'fabloom-cart',
            onRehydrateStorage: () => (state) => {
                // Recompute totalItems after hydration from localStorage
                if (state) {
                    state.totalItems = computeTotalItems(state.items);
                }
            },
        }
    )
);
