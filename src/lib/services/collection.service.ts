import Collection from '@/models/Collection';
import { ICollectionModel } from '@/models/Collection';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

export interface CollectionTreeNode extends ICollectionModel {
    children: CollectionTreeNode[];
}

export class CollectionService {
    /**
     * Initializes DB connection
     */
    private static async init() {
        await dbConnect();
    }

    /**
     * Builds a tree of collections for navigation
     */
    static async getCollectionTree(moduleId?: string): Promise<CollectionTreeNode[]> {
        await this.init();
        const query: any = { isActive: true };
        if (moduleId) query.moduleId = moduleId;
        
        const allCollections = await Collection.find(query).sort({ displayOrder: 1 }).lean();
        
        const map = new Map<string, CollectionTreeNode>();
        const roots: CollectionTreeNode[] = [];

        // Initialize map
        for (const col of allCollections) {
            map.set(col._id.toString(), { ...col, children: [] } as CollectionTreeNode);
        }

        // Build tree
        for (const col of allCollections) {
            const node = map.get(col._id.toString())!;
            if (col.parentId) {
                const parent = map.get(col.parentId.toString());
                if (parent) {
                    parent.children.push(node);
                }
            } else {
                roots.push(node);
            }
        }

        return roots;
    }

    /**
     * Resolves an array of slugs into a specific Collection document
     * e.g. ['readymades', 'kandoora', 'saudi']
     */
    static async resolvePath(slugs: string[]): Promise<ICollectionModel | null> {
        if (!slugs || slugs.length === 0) return null;
        await this.init();

        const targetSlug = slugs[slugs.length - 1];
        // We verify the whole path to ensure 'saudi' is actually under 'kandoora' and 'readymades'
        const candidate = await Collection.findOne({ slug: targetSlug, isActive: true }).lean();
        if (!candidate) return null;

        const breadcrumbs = await this.getBreadcrumbs(candidate._id.toString());
        
        // Verify path matches breadcrumbs length and slugs
        if (breadcrumbs.length !== slugs.length) return null;
        for (let i = 0; i < slugs.length; i++) {
            if (breadcrumbs[i].slug !== slugs[i]) return null;
        }

        return candidate as ICollectionModel;
    }

    /**
     * Generates a breadcrumb trail (from root to target)
     */
    static async getBreadcrumbs(collectionId: string): Promise<ICollectionModel[]> {
        await this.init();
        const breadcrumbs: ICollectionModel[] = [];
        let currentId: string | null = collectionId;

        while (currentId) {
            const node = await Collection.findById(currentId).lean();
            if (!node) break;
            breadcrumbs.unshift(node as ICollectionModel);
            currentId = node.parentId ? node.parentId.toString() : null;
        }

        return breadcrumbs;
    }

    /**
     * Lookup all direct child collections
     */
    static async getChildCollections(parentId: string): Promise<ICollectionModel[]> {
        await this.init();
        return Collection.find({ parentId: new mongoose.Types.ObjectId(parentId), isActive: true })
            .sort({ displayOrder: 1 })
            .lean();
    }
}
