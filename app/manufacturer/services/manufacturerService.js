const Manufacturer = require('../model/manufacturerModel');

exports.findAlllManufacturersWithProducts = () => {
  const manufacturers = Manufacturer.find({}).populate('listIdProduct').exec();

  return manufacturers;
};
