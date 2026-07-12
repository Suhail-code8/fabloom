export type CollectionType = 'STANDARD' | 'EDITORIAL' | 'SEASONAL' | 'FEATURED';

export interface ICollection {
    _id: string;
    name: string;
    slug: string;
    parentId: string | null;
    moduleId: string; // e.g. 'readymades', 'fabrics'
    type: CollectionType;

    // Content
    heroImage?: string;
    editorialText?: string;
    featuredProductIds?: string[];
    buyingGuideUrl?: string;
    showTestimonials?: boolean;
    
    // Config
    seoTitle?: string;
    metaDescription?: string;
    isActive: boolean;
    displayOrder: number;

    createdAt: string;
    updatedAt: string;
}
