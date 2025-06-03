import CategoryModel from "../Schema/Category.js";
import { createSlug } from "../helper/utilities.helper.js";

export const createCategory = async (req, res) => {
  try {
    let { name } = req.body;

    if (name.length < 3) {
      return res.send({
        success: false,
        message: "Category Name Must be 3 Character Long!",
      });
    }

    const existingCategory = await CategoryModel.exists({
      name: name,
    });

    if (existingCategory) {
      return res.send({
        success: false,
        message: "Category Already Present In Database!",
      });
    }

    const slug = await createSlug(name);

    const category = new CategoryModel({ name, slug });

    await category.save();

    return res.status(200).send(category);
  } catch (error) {
    res.status(501).send({ success: false, message: `Something Went Wrong` });
    console.log(error);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res.send({ success: false, message: `Category id not found!` });
    }

    const deleteCat = await CategoryModel.findByIdAndDelete(categoryId);

    if (!deleteCat) {
      return {
        success: false,
        message: "Invalid Category Id!",
      };
    }

    return res
      .status(200)
      .send({ success: true, message: `Deleted Successfully!`, deleteCat });
  } catch (error) {
    return res
      .status(501)
      .send({ success: false, message: `Something Went Wrong`, error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    if (name.length < 3) {
      return res.send({
        success: false,
        message: "Category Name Must be 3 Character Long!",
      });
    }

    if (!categoryId) {
      return res.send({ success: false, message: `Category id not found!` });
    }

    const slug = await createSlug(name);

    const category = await CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        name,
        slug,
      },
      { new: true }
    );

    return res.send({ success: true, message: `Category Updated Successfully!`, category });
  } catch (error) {
    res
      .status(501)
      .send({ success: false, message: `Something Went Wrong`, error });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    return res.status(200).send(categories);
  } catch (error) {
    res.status(501).send({ success: false, message: `Something Went Wrong` });
    console.log(error);
  }
};
