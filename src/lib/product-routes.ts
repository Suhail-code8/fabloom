/** Storefront path segment for a product type (URL uses plural for fabrics). */
export function productTypeToPathSegment(type: string): string {
    if (type === 'fabric') return 'fabrics';
    if (type === 'readymade') return 'readymade';
    return 'accessories';
}

/** Product detail page href. */
export function getProductDetailHref(product: {
    type: string;
    slug?: string;
    _id: string;
}): string {
    const segment = productTypeToPathSegment(product.type);
    const identifier = product.slug || product._id;
    return `/${segment}/${identifier}`;
}
