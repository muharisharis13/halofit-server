const superAdminModel = require("../../models/SuperAdmin");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
class controllerAdmin {
  async getSuperAdmin(req, res) {
    const { adminId } = req.params;
    try {
      const getAdmin = await superAdminModel.findOne({
        where: {
          id: adminId,
        },
      });
      responseJSON({
        res,
        status: 200,
        data: getAdmin,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }
}

module.exports = new controllerAdmin();
