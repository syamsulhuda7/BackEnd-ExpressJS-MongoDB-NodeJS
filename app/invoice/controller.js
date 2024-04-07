const { subject } = require("@casl/ability");
const { policyFor } = require("../../utils");
const Invoice = require("../invoice/model");

const show = async(req, res, next) => {
  try {
    // let policy = policyFor(req.user);
    // console.log(invoice.user._id);
    // let subjectInvoice = subject("Invoice", {
    //   // ...invoice,
    //   user_id: invoice.user._id,
    // });
    // if (!policy.can("read", subjectInvoice)) {
    //   return res.json({
    //     error: 1,
    //     message: "Anda tidak memiliki akses untuk melihat invoice ini",
    //   });
    // }

    let { order_id } = req.params;
    // console.log(order_id);
    // console.log(Invoice.find());
    let invoice = await Invoice.findOne({ order: order_id })
      .populate("order")
      .populate("user");

      if (invoice) {
        return res.json(invoice);
    } else {
        return res.json({
            error: 1,
            message: "Invoice tidak ditemukan",
        });
    }
  } catch (err) {
    return res.json({
      error: 1,
      message: "Error when getting invoice",
    });
  }
};

module.exports = {show};
