import ContactModel from "../Schema/Contact.js";

export const contact = async (req, res) => {
  try {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const { firstName, lastName, phoneNumber, email, isStore, message } =
      req.body;
    if (
      firstName == "" ||
      lastName == "" ||
      phoneNumber == "" ||
      email == "" ||
      isStore == "" ||
      message == ""
    ) {
      return res.send({
        success: false,
        message: "Please fill all the felids!",
      });
    }

    if (!emailRegex.test(email)) {
      return res.send({
        success: false,
        message: "Invalid Email Address!",
      });
    }

    const contact = new ContactModel({ firstName, lastName, phoneNumber, email, isStore, message });

    await contact.save();

    return res.status(200).send({success: true, message: "Submitted Successfully!"});
  } catch (error) {
    return res
      .status(501)
      .send({ success: false, message: error.message, error });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { Id } = req.query;
    if (!Id) {
      return res.send({ success: false, message: `Contact Id not found!` });
    }

    const contactDelete = await ContactModel.findByIdAndDelete(Id);

    if (!contactDelete) {
      return {
        success: false,
        message: "Contact not found!",
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

export const getAllContact = async (req, res) => {
  try {
    const contact = await ContactModel.find();
    return res.status(200).send(contact);
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .send({ success: false, message: `Something Went Wrong` });
  }
};
