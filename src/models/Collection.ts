import mongoose, { Schema, Document, Model } from 'mongoose';
import { CollectionType } from '@/types/collection';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ICollectionModel extends Document {
    name: string;
    slug: string;
    parentId: mongoose.Types.ObjectId | null;
    moduleId: string; // e.g. 'readymades', 'fabrics'
    type: CollectionType;

    // Content
    heroImage?: string;
    editorialText?: string;
    featuredProductIds?: mongoose.Types.ObjectId[];
    buyingGuideUrl?: string;
    showTestimonials: boolean;
    
    // Config
    seoTitle?: string;
    metaDescription?: string;
    isActive: boolean;
    displayOrder: number;

    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// SCHEMAS
// ============================================================================

const collectionSchema = new Schema<ICollectionModel>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        parentId: { type: Schema.Types.ObjectId, ref: 'Collection', default: null },
        moduleId: { type: String, required: true },
        type: { 
            type: String, 
            enum: ['STANDARD', 'EDITORIAL', 'SEASONAL', 'FEATURED'], 
            default: 'STANDARD' 
        },

        // Content
        heroImage: { type: String },
        editorialText: { type: String },
        featuredProductIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        buyingGuideUrl: { type: String },
        showTestimonials: { type: Boolean, default: false },

        // Config
        seoTitle: { type: String },
        metaDescription: { type: String },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// Indexes for fast hierarchy and routing queries
collectionSchema.index({ slug: 1 });
collectionSchema.index({ parentId: 1 });
collectionSchema.index({ moduleId: 1, isActive: 1 });

const Collection: Model<ICollectionModel> = 
    mongoose.models.Collection || mongoose.model<ICollectionModel>('Collection', collectionSchema);

export default Collection;
