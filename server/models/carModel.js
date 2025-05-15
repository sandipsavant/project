import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const carSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    additionalImages: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
      default: 0,
    },
    year: {
      type: Number,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      default: 2,
    },
    transmission: {
      type: String,
      required: true,
      enum: ['Automatic', 'Manual'],
      default: 'Automatic',
    },
    fuelType: {
      type: String,
      required: true,
      default: 'Gasoline',
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
    features: [
      {
        type: String,
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model('Car', carSchema);

export default Car;