import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

// Stitching details for fabric products
export interface StitchingDetails {
    style: 'Jubbah' | 'Kurta' | 'Shirt' | 'Kandura';
    measurements: {
        neck: number;
        chest: number;
        waist: number;
        shoulder: number;
        sleeveLength: number;
        shirtLength: number;
    };
    notes?: string;
}

// Base cart item
interface BaseCartItem {
    id: string; // Unique cart item ID
    productId: string; // Product MongoDB ID
    name: string;
    image: string;
    type: 'readymade' | 'fabric' | 'accessory';
    quantity: number;
}

// Readymade cart item
export interface ReadymadeCartItem extends BaseCartItem {
    type: 'readymade';
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    price: number;
    material?: string;
    color?: string;
}

// Fabric cart item (with optional stitching)
export interface FabricCartItem extends BaseCartItem {
    type: 'fabric';
    pricePerMeter: number;
    meters: number; // Quantity in meters
    fabricType?: string;
    stitchingDetails?: StitchingDetails;
    stitchingPrice?: number;
}

// Accessory cart item
export interface AccessoryCartItem extends BaseCartItem {
    type: 'accessory';
    price: number;
    material?: string;
    color?: string;
}

// Union type for all cart items
export type CartItem = ReadymadeCartItem | FabricCartItem | AccessoryCartItem;

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    cartTotal: () => number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Generate unique ID for cart item
const generateCartItemId = (item: CartItem): string => {
    if (item.type === 'readymade') {
        return `${item.productId}-${item.size}`;
    } else if (item.type === 'fabric' && item.stitchingDetails) {
        // Each custom stitched fabric is unique
        return `${item.productId}-custom-${Date.now()}`;
    } else {
        return item.productId;
    }
};

// Calculate item total price
const getItemTotal = (item: CartItem): number => {
    if (item.type === 'readymade') {
        return item.price * item.quantity;
    } else if (item.type === 'fabric') {
        const fabricCost = item.pricePerMeter * item.meters;
        const stitchingCost = item.stitchingDetails && item.stitchingPrice
            ? item.stitchingPrice
            : 0;
        return (fabricCost + stitchingCost) * item.quantity;
    } else {
        return item.price * item.quantity;
    }
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            // Add item to cart
            addItem: (newItem) => {
                const items = get().items;
                const itemId = generateCartItemId(newItem);

                // Check if item already exists
                const existingItemIndex = items.findIndex((item) => item.id === itemId);

                if (existingItemIndex > -1) {
                    // Item exists - update quantity
                    // Only for readymade and non-custom fabric items
                    if (newItem.type === 'readymade' ||
                        (newItem.type === 'fabric' && !newItem.stitchingDetails)) {
                        const updatedItems = [...items];
                        updatedItems[existingItemIndex].quantity += newItem.quantity;
                        set({ items: updatedItems });
                        return;
                    }
                }

                // Add as new item (with generated ID)
                set({ items: [...items, { ...newItem, id: itemId }] });
            },

            // Remove item from cart
            removeItem: (itemId) => {
                set({ items: get().items.filter((item) => item.id !== itemId) });
            },

            // Update item quantity
            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }

                const updatedItems = get().items.map((item) =>
                    item.id === itemId ? { ...item, quantity } : item
                );
                set({ items: updatedItems });
            },

            // Clear entire cart
            clearCart: () => {
                set({ items: [] });
            },

            // Get total number of items
            totalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            // Get cart total price
            cartTotal: () => {
                return get().items.reduce((total, item) => total + getItemTotal(item), 0);
            },
        }),
        {
            name: 'fabloom-cart-storage', // localStorage key
        }
    )
);
