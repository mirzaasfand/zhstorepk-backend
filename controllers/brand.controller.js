import { createSlug } from "../helper/utilities.helper.js";
import BrandModel from "../Schema/Brand.js";

export const addBrand = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!image) {
      return res.send({
        success: false,
        message: "Brand Image is required!",
      });
    }

    if (name.length < 2) {
      return res.send({
        success: false,
        message: "Brand Name Must be 2 Character Long!",
      });
    }

    const existingBrand = await BrandModel.exists({
      name: name,
    });
    if (existingBrand) {
      return res.send({
        success: false,
        message: "Brand is Already Added!",
      });
    }

    const slug = await createSlug(name);

    const brand = new BrandModel({ name, image, slug });

    await brand.save();

    return res.status(200).send(brand);
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .send({ success: false, message: "Something Went Wrong" });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { Id } = req.query;
    if (!Id) {
      return res.send({ success: false, message: `Brand not found!` });
    }

    const deleteBrand = await BrandModel.findByIdAndDelete(Id);

    if (!deleteBrand) {
      return {
        success: false,
        message: "Invalid Brand Id!",
      };
    }

    return res
      .status(200)
      .send({ success: true, message: `Deleted Successfully!`, deleteBrand });
  } catch (error) {
    return res
      .status(501)
      .send({ success: false, message: `Something Went Wrong`, error });
  }
};

export const updateBrandImg = async (req, res) => {
  try {
    const { Id, image } = req.body;
    if (!image) {
      return res.send({
        success: false,
        message: "Brand Image is required!",
      });
    }

    if (!Id) {
      return res.send({ success: false, message: `Brand id is Required!` });
    }

    const brand = await BrandModel.findByIdAndUpdate(
      Id,
      {
        image,
      },
      { new: true }
    );

    return res.send({
      success: true,
      message: `Brand Image Updated Successfully!`,
      brand,
    });
  } catch (error) {
    return res
      .status(501)
      .send({ success: false, message: `Something Went Wrong`, error });
  }
};

export const updateBrandName = async (req, res) => {
  try {
    const { name, Id } = req.body;

    if (name.length < 2) {
      return res.send({
        success: false,
        message: "Brand Name Must be 2 Character Long!",
      });
    }

    if (!Id) {
      return res.send({ success: false, message: `Brand id is Required!` });
    }

    const slug = await createSlug(name);

    const brand = await BrandModel.findByIdAndUpdate(
      Id,
      {
        name,
        slug,
      },
      { new: true }
    );

    return res.send({
      success: true,
      message: `Brand Name Updated Successfully!`,
      brand,
    });
  } catch (error) {
    return res
      .status(501)
      .send({ success: false, message: `Something Went Wrong`, error });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brands = await BrandModel.find();

    return res.status(200).send(brands);
  } catch (error) {
    console.log(error);
    return res.status(501).send({ success: false, message: `Something Went Wrong` });
  }
};
