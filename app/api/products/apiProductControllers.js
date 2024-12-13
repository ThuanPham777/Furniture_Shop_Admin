const productService = require('../../products/services/productService');
exports.getProductsAPI = async (req, res) => {
  try {
    const filters = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const { products, totalPages } = await productService.getProducts(
      filters,
      page,
      limit
    );

    res.json({ products, totalPages, currentPage: page });
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

exports.addProduct = async (req, res) => {
  try {
    // Call the service to create the product
    const newProduct = await productService.createProduct(req.body, req.files);
    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Error adding product' });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProduct = await productService.updateProduct(
      productId,
      req.body
    );
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};
