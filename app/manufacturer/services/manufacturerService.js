const Manufacturer = require('../model/manufacturerModel');

exports.getAllManufacturerNames = async () => {
  const manufacturers = await Manufacturer.find({}, 'name').lean();
  return manufacturers.map((manufacturer) => manufacturer.name);
};
exports.findAlllManufacturersWithProducts = () => {
  const manufacturers = Manufacturer.find({}).populate('listIdProduct').exec();

  return manufacturers;
};
