const manufacturerService = require('../../manufacturer/services/manufacturerService');
exports.getManufacturers = async (req, res) => {
  try {
    const filter = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    // Gọi service để lấy danh mục phân trang
    const { manufacturers, totalPages, currentPage } =
      await manufacturerService.findAllManufacturersWithProducts(
        filter,
        page,
        limit
      );

    res.json({
      manufacturers,
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error('Error fetching Manufacturers:', error);
    res.status(500).json({ message: 'Error fetching Manufacturers' });
  }
};
exports.addManufacturer = async (req, res) => {
  try {
    const { name } = req.body;
    const newManufacturer = await manufacturerService.addManufacturer(name);
    res.json({
      success: true,
      message: 'manufacturer added successfully!',
      newManufacturer,
    });
  } catch (error) {
    console.error('Error adding manufacturer:', error);
    res.status(500).json({ message: 'Error adding manufacturer' });
  }
};

exports.editManufacturer = async (req, res) => {
  try {
    const manufacturerId = req.params.manufacturerId;
    const { name } = req.body;
    const manufacturerExists = await manufacturerService.manufacturerExists(
      manufacturerId
    );
    if (!manufacturerExists) {
      return res.status(404).send('manufacturer not found');
    }
    const updatedManufacturer = await manufacturerService.editManufacturer(
      manufacturerId,
      name
    );

    res.json({
      success: true,
      message: 'manufacturer updated successfully!',
      updatedManufacturer,
    });
  } catch (error) {
    console.error('Error editing manufacturer:', error);
    res.status(500).json({ message: 'Error editing manufacturer' });
  }
};

exports.deleteManufacturer = async (req, res) => {
  try {
    const manufacturerId = req.params.manufacturerId;
    const manufacturerExists = await manufacturerService.manufacturerExists(
      manufacturerId
    );
    if (!manufacturerExists) {
      return res.status(404).send('manufacturer not found');
    }
    await manufacturerService.deleteManufacturer(manufacturerId);
    res.json({ success: true, message: 'manufacturer deleted successfully!' });
  } catch (error) {
    console.error('Error deleting manufacturer:', error);
    res.status(500).json({ message: 'Error deleting manufacturer' });
  }
};
