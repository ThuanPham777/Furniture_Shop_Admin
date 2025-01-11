const manufacturerService = require('../services/manufacturerService');

exports.renderManufacturerPage = async (req, res) => {
  try {
    // Lấy thông tin trang và giới hạn từ query params, mặc định là trang 1, mỗi trang 4 mục
    const filters = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const { manufacturers, totalPages, currentPage } =
      await manufacturerService.findAllManufacturersWithProducts(
        filters,
        page,
        limit
      );

    // Render trang quản lý danh mục với dữ liệu danh mục
    res.render('manufacturer/manufacturer', {
      manufacturers,
      totalPages,
      currentPage,
      filters,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
};

exports.renderAddManufacturer = async (req, res) => {
  try {
    const existingManufacturer = await manufacturerService.findManufacturerById(
      req.params.manufacturerId
    );
    res.render('manufacturer/add-manufacturer', {
      manufacturer: existingManufacturer || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
};
