import BannerModel from "../Schema/Banner.js";

export const uploadBanner = async (req, res) => {
  try {
    const { imageURL, bannerImageAltText } = req.body;

    if (!imageURL || !bannerImageAltText) {
      return res.send({
        success: false,
        message: "Please fill all the felids!",
      });
    }

    const banner = new BannerModel({ imageURL, bannerImageAltText });

    await banner.save();

    return res
      .status(200)
      .send({ success: true, message: "Banner Uploaded Successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .send({ success: false, message: "Something Went Wrong" });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.query;
    if (!bannerId) {
      return res.send({ success: false, message: `Banner Id not found!` });
    }

    const banner = await BannerModel.findByIdAndDelete(bannerId);

    if (!banner) {
      return {
        success: false,
        message: "Banner Not found!",
      };
    }

    return res
      .status(200)
      .send({ success: true, message: `Deleted Successfully!` });
  } catch (error) {
    return res
      .status(501)
      .send({ success: false, message: error.message, error });
  }
};

export const getAllBanner = async (req, res) => {
  try {
    const banners = await BannerModel.find();

    return res.status(200).send({ success: true, banners });
  } catch (error) {
    return res
      .status(501)
      .send({ success: false, message: error.message, error });
  }
};

export const updateBannerImg = async (req, res) => {
  try {
    const { Id, imageURL } = req.body;
    if (!imageURL) {
      return res.send({
        success: false,
        message: "Banner Image is required!",
      });
    }

    if (!Id) {
      return res.send({ success: false, message: `Banner id is Required!` });
    }

    const banner = await BannerModel.findByIdAndUpdate(
      Id,
      {
        imageURL,
      },
      { new: true }
    );

    return res.send({
      success: true,
      message: `Banner Image Updated Successfully!`,
      banner,
    });
  } catch (error) {
    return res
      .status(501)
      .send({ success: false, message: error.message, error });
  }
};

export const updateBannerAltText = async (req, res) => {
  try {
    const { bannerImageAltText, Id } = req.body;

    if (!bannerImageAltText) {
      return res.send({
        success: false,
        message: "Banner Image alt text is required!",
      });
    }

    if (!Id) {
      return res.send({ success: false, message: `Banner id is missing!` });
    }

    await BannerModel.findByIdAndUpdate(
      Id,
      {
        bannerImageAltText,
      },
      { new: true }
    );

    return res.send({
      success: true,
      message: `Banner Image Alt Text Updated Successfully!`,
    });
  } catch (error) {
    return res
      .status(501)
      .send({ success: false, message: error.message, error });
  }
};
