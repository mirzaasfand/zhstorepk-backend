import ProductModel from "../Schema/Product.js";
import CategoryModel from "../Schema/Category.js";
import BrandModel from "../Schema/Brand.js";
import { createSlug } from "../helper/utilities.helper.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      ytVideoURL,
      tags,
      mainImg,
      mainImgAltText,
      backImg,
      backImgAltText,
      galleryImgs,
      variationImgs,
      price,
      discountedPrice,
      available,
      sold,
      seoTitle,
      seoDescription,
      seoTags,
      variation,
    } = req.body;
    if (
      !name ||
      !description ||
      !category ||
      !brand ||
      !ytVideoURL ||
      !tags ||
      !mainImg ||
      !mainImgAltText ||
      !backImg ||
      !backImgAltText ||
      !galleryImgs ||
      !variationImgs ||
      !price ||
      !discountedPrice ||
      !available ||
      !sold ||
      !seoTitle ||
      !seoDescription ||
      !seoTags ||
      !variation
    ) {
      return res.send({
        success: false,
        message: "Please Fill all the fields!",
      });
    }

    if (galleryImgs.length < 0) {
      return res.send({
        success: false,
        message: "Images Gallery is empty!",
      });
    }

    const slug = await createSlug(name);

    const existingProduct = await ProductModel.exists({
      "productInfo.slug": slug,
    });

    if (existingProduct) {
      return res.send({
        success: false,
        message: "Product is Already Added! Change the name!",
      });
    }

    const product = new ProductModel({
      "productInfo.slug": slug,
      "productInfo.name": name,
      "productInfo.description": description,
      "productInfo.category": category,
      "productInfo.ytVideoURL": ytVideoURL,
      "productInfo.brand": brand,
      "productInfo.tags": tags,
      "productInfo.variation": variation,
      "images.mainImg": mainImg,
      "images.mainImgAltText": mainImgAltText,
      "images.backImg": backImg,
      "images.backImgAltText": backImgAltText,
      "images.galleryImgs": galleryImgs,
      "images.variationImgs": variationImgs,
      "price.price": price,
      "price.discountedPrice": discountedPrice,
      "stock.available": available,
      "stock.sold": sold,
      "seo.seoTitle": seoTitle,
      "seo.seoDescription": seoDescription,
      "seo.seoTags": seoTags,
    });

    await product.save();

    return res.status(200).send(product);
  } catch (error) {
    console.log(error);
    return res.status(501).send({
      success: false,
      message: "Internal Server Error! Try Again",
      error,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      ytVideoURL,
      brand,
      tags,
      variation,
      mainImg,
      mainImgAltText,
      backImg,
      backImgAltText,
      galleryImgs,
      variationImgs,
      price,
      discountedPrice,
      available,
      sold,
      seoTitle,
      seoDescription,
      seoTags,
      updateSlug,
    } = req.body;

    if (!updateSlug) {
      return res.send({ success: false, message: "Product Slug not Found!" });
    }

    if (
      !name ||
      !description ||
      !category ||
      !ytVideoURL ||
      !brand ||
      !tags ||
      !variation ||
      !mainImg ||
      !mainImgAltText ||
      !backImg ||
      !backImgAltText ||
      !galleryImgs ||
      !variationImgs ||
      !price ||
      !discountedPrice ||
      !available ||
      !sold ||
      !seoTitle ||
      !seoDescription ||
      !seoTags
    ) {
      return res.send({
        success: false,
        message: "Please Fill all the fields!",
      });
    }

    if (galleryImgs.length < 0) {
      return res.send({
        success: false,
        message: "Images Gallery is empty!",
      });
    }

    const slug = await createSlug(name);

    const product = await ProductModel.findOneAndUpdate(
      { "productInfo.slug": updateSlug },
      {
        "productInfo.slug": slug,
        "productInfo.name": name,
        "productInfo.description": description,
        "productInfo.category": category,
        "productInfo.ytVideoURL": ytVideoURL,
        "productInfo.brand": brand,
        "productInfo.tags": tags,
        "productInfo.variation": variation,
        "images.mainImg": mainImg,
        "images.mainImgAltText": mainImgAltText,
        "images.backImg": backImg,
        "images.backImgAltText": backImgAltText,
        "images.galleryImgs": galleryImgs,
        "images.variationImgs": variationImgs,
        "price.price": price,
        "price.discountedPrice": discountedPrice,
        "stock.available": available,
        "stock.sold": sold,
        "seo.seoTitle": seoTitle,
        "seo.seoDescription": seoDescription,
        "seo.seoTags": seoTags,
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Product Updated Successfully!",
      product,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Internal Server Error! Try Again",
      error,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId) {
      return res.send({ success: false, message: `Product Id not found!` });
    }

    const deleteProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deleteProduct) {
      return {
        success: false,
        message: "Product Id is missing!",
      };
    }

    return res
      .status(200)
      .send({ success: true, message: `Deleted Successfully!`, deleteProduct });
  } catch (error) {
    return res
      .status(501)
      .send({ success: false, message: `Something Went Wrong`, error });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    let { page = 1 } = req.query;
    page = parseInt(page);
    const maxLimit = 12;

    const product = await ProductModel.find()
      .sort({ joinedAt: -1 })
      .select(
        "_id productInfo.name productInfo.slug images.mainImg images.mainImgAltText images.backImg images.backImgAltText price.price price.discountedPrice"
      )
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(501).send({ success: false, message: "Something Went Wrong" });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    let { slug } = req.query;
    if (!slug) {
      return res.send({ success: false, message: "Slug is required!" });
    }

    const getProduct = await ProductModel.find({ "productInfo.slug": slug })
      .populate("productInfo.category")
      .populate("productInfo.brand");
    if (!getProduct) {
      return res.send({ success: false, message: "Product not found!" });
    }

    return res.status(200).send({
      success: true,
      message: "Product Find Successfully!",
      getProduct,
    });
  } catch (error) {
    return res.status(501).send({ success: false, message: error.message });
  }
};

export const searchEngine = async (req, res) => {
  try {
    let { page = 1, query } = req.query;
    page = parseInt(page);
    const maxLimit = 12;

    const queryParam = new URLSearchParams(query);
    const minPrice = Number(queryParam.get("minPrice")) || 0;
    const maxPrice = Number(queryParam.get("maxPrice")) || 0;

    if (minPrice != 0 || maxPrice != 0) {
      const product = await ProductModel.find({
        "price.price": { $gte: minPrice, $lte: maxPrice },
      })
        .sort({ joinedAt: -1 })
        .select(
          "_id productInfo.name productInfo.slug images.mainImg images.mainImgAltText images.backImg images.backImgAltText price.price price.discountedPrice stock.sold"
        )
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);

      return res.status(200).json({ success: true, product });
    }

    if (!query || query == "latest" || query == "new") {
      const product = await ProductModel.find()
        .sort({ joinedAt: -1 })
        .select(
          "_id productInfo.name productInfo.slug images.mainImg images.mainImgAltText images.backImg images.backImgAltText price.price price.discountedPrice stock.sold"
        )
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);

      return res.status(200).json({ success: true, product });
    }

    if (query == "oldest") {
      const product = await ProductModel.find()
        .sort({ joinedAt: 1 })
        .select(
          "_id productInfo.name productInfo.slug images.mainImg images.mainImgAltText images.backImg images.backImgAltText price.price price.discountedPrice stock.sold"
        )
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);

      return res.status(200).json({ success: true, product });
    }

    if (query == "available") {
      const product = await ProductModel.find({
        "stock.available": { $gt: 0 },
      })
        .sort({ joinedAt: -1 })
        .select(
          "_id productInfo.name productInfo.slug images.mainImg images.mainImgAltText images.backImg images.backImgAltText price.price price.discountedPrice stock.sold"
        )
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);

      return res.status(200).json({ success: true, product });
    }

    if (query == "out-of-stock") {
      const product = await ProductModel.find({
        "stock.available": 0,
      })
        .sort({ joinedAt: -1 })
        .select(
          "_id productInfo.name productInfo.slug images.mainImg images.mainImgAltText images.backImg images.backImgAltText price.price price.discountedPrice stock.sold"
        )
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);

      return res.status(200).json({ success: true, product });
    }

    const category = await CategoryModel.findOne({ slug: query });
    if (category) {
      const product = await ProductModel.find({
        "productInfo.category": category._id,
      })
        .sort({ joinedAt: -1 })
        .select(
          "_id productInfo.name productInfo.slug images.mainImg images.mainImgAltText images.backImg images.backImgAltText price.price price.discountedPrice stock.sold"
        )
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);
      return res.status(200).json({ success: true, product });
    }

    const brand = await BrandModel.findOne({ slug: query });
    if (brand) {
      const product = await ProductModel.find({
        "productInfo.brand": brand._id,
      })
        .sort({ joinedAt: -1 })
        .select(
          "_id productInfo.name productInfo.slug images.mainImg images.mainImgAltText images.backImg images.backImgAltText price.price price.discountedPrice stock.sold"
        )
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);
      return res.status(200).json({ success: true, product });
    }

    const searchRegex = new RegExp(query, "i");
    const searchFilter = {
      $or: [
        {
          "productInfo.name": { $regex: searchRegex },
        },
        {
          "productInfo.slug": { $regex: searchRegex },
        },
        {
          "productInfo.description": { $regex: searchRegex },
        },
        {
          "productInfo.variation": { $regex: searchRegex },
        },
        {
          "seo.seoTitle": { $regex: searchRegex },
        },
        {
          "seo.seoDescription": { $regex: searchRegex },
        },
        {
          "seo.seoTags": { $regex: searchRegex },
        },
      ],
    };

    const product = await ProductModel.find(searchFilter)
      .sort({ joinedAt: -1 })
      .select(
        "_id productInfo.name productInfo.slug images.mainImg images.mainImgAltText images.backImg images.backImgAltText price.price price.discountedPrice stock.sold"
      )
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);

    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(501).send({ success: false, message: error.message });
  }
};
