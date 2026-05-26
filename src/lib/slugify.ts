import { Product } from '@/models/Product';

/** URL-safe slug from product name (matches product validation regex). */
export function slugify(text: string): string {
    const slug = text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 180);

    return slug || 'product';
}

/** Picks a unique slug, appending -2, -3, … if the base is taken. */
export async function ensureUniqueProductSlug(name: string): Promise<string> {
    const base = slugify(name);
    let slug = base;
    let suffix = 2;

    while (await Product.exists({ slug })) {
        slug = `${base}-${suffix}`;
        suffix += 1;
    }

    return slug;
}
