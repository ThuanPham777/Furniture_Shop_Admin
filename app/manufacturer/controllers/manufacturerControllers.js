const manufacturerService = require('../services/manufacturerService');

exports.renderManufacturerPage = async (req, res) => {
  try {
    const manufacturers =
      await manufacturerService.findAlllManufacturersWithProducts();
    res.render('manufacturer/manufacturer', { manufacturers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
};
