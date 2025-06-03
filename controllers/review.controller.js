import ReviewModel from "../Schema/Review.js";

export const addReview = async (req, res) => {
  try {
    const { product, rating, comment, image, name, email } = req.body;
    if (!product || !rating || !comment || !image || !name || !email) {
      return res.send({
        success: false,
        message: "Please Fill all the fields!",
      });
    }

    const review = new ReviewModel({
      product,
      rating,
      comment,
      image,
      name,
      email,
    });

    await review.save();

    return res
      .status(200)
      .send({ success: true, message: "Review Added Successfully!" });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: error.message,
      error,
    });
  }
};

export const getReviewByProduct = async (req, res) => {
  try {
    const { product, page = 1 } = req.body;
    const parsedPage = parseInt(page);
    const maxLimit = 2;

    if (product == null || product == undefined || !product) {
      return res.send({
        success: false,
        message: "Something is missing!",
      });
    }

    const review = await ReviewModel.find({ product })
      .skip((parsedPage - 1) * maxLimit)
      .limit(maxLimit);

    if (!review || review.length === 0) {
      return res.send({
        success: true,
        message: "No Reviews Found!",
        review,
      });
    }

    return res.status(200).send({ success: true, review });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: error.message,
      error,
    });
  }
};

export const getAllReview = async (req, res) => {
  try {
    const review = await ReviewModel.find();

    if (!review || review.length === 0) {
      return res.send({
        success: true,
        message: "No Reviews Found!",
      });
    }

    return res.status(200).send({ success: true, review });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: error.message,
      error,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.send({
        success: false,
        message: "Something is missing!",
      });
    }

    const review = await ReviewModel.findByIdAndDelete(id);
    if (!review) {
      return res.send({
        success: false,
        message: "Review Not Found!",
      });
    }

    return res
      .status(200)
      .send({ success: true, message: "Review Deleted Successfully!" });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: error.message,
      error,
    });
  }
};

export const getRatingByProduct = async (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.send({
        success: false,
        message: "Product ID is missing!",
      });
    }

    const reviews = await ReviewModel.find({ product });

    if (!reviews || reviews.length === 0) {
      return res.send({
        success: true,
        message: "No ratings found!",
        ratings: {
          "5_star": 0,
          "4_star": 0,
          "3_star": 0,
          "2_star": 0,
          "1_star": 0,
          average: 0,
          totalRating: 0,
        },
      });
    }

    // Initialize counters
    let count5 = 0, count4 = 0, count3 = 0, count2 = 0, count1 = 0, sum = 0;

    reviews.forEach((review) => {
      const rating = review.rating;
      sum += rating;

      if (rating === 5) count5++;
      else if (rating === 4) count4++;
      else if (rating === 3) count3++;
      else if (rating === 2) count2++;
      else if (rating === 1) count1++;
    });

    const totalRating = reviews.length;
    const average = (sum / totalRating).toFixed(1);

    return res.status(200).send({
      success: true,
      ratings: {
        "5_star": count5,
        "4_star": count4,
        "3_star": count3,
        "2_star": count2,
        "1_star": count1,
        average: parseFloat(average),
        totalRating,
      },
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: error.message,
      error,
    });
  }
};
