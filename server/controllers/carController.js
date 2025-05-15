import Car from '../models/carModel.js';

// @desc    Fetch all cars
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const cars = await Car.find({ ...keyword });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single car
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      res.json(car);
    } else {
      res.status(404);
      throw new Error('Car not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
export const createCar = async (req, res) => {
  try {
    const car = new Car({
      name: req.body.name,
      brand: req.body.brand,
      image: req.body.image,
      additionalImages: req.body.additionalImages,
      description: req.body.description,
      category: req.body.category,
      pricePerDay: req.body.pricePerDay,
      year: req.body.year,
      seats: req.body.seats,
      transmission: req.body.transmission,
      fuelType: req.body.fuelType,
      available: req.body.available,
      features: req.body.features,
    });

    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
export const updateCar = async (req, res) => {
  try {
    const {
      name,
      brand,
      image,
      additionalImages,
      description,
      category,
      pricePerDay,
      year,
      seats,
      transmission,
      fuelType,
      available,
      features,
    } = req.body;

    const car = await Car.findById(req.params.id);

    if (car) {
      car.name = name || car.name;
      car.brand = brand || car.brand;
      car.image = image || car.image;
      car.additionalImages = additionalImages || car.additionalImages;
      car.description = description || car.description;
      car.category = category || car.category;
      car.pricePerDay = pricePerDay || car.pricePerDay;
      car.year = year || car.year;
      car.seats = seats || car.seats;
      car.transmission = transmission || car.transmission;
      car.fuelType = fuelType || car.fuelType;
      car.available = available !== undefined ? available : car.available;
      car.features = features || car.features;

      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404);
      throw new Error('Car not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};