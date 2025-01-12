function getVariationImage(products, productId, variationType, variationValue) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.variationImages) return null;

    for (const [key, value] of Object.entries(product.variationImages)) {
        const parsedKey = JSON.parse(key);
        if (parsedKey[variationType] === variationValue) {
            return value;
        }
    }
    return null;
}