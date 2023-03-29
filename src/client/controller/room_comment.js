const roomCommentModel = require("../../models/room_comment");
const { general } = require("../../../utils");

const { responseJSON } = general;

class controllerRoomComment {
  async createRoomComment(req, res) {
    const { roomId, userId, comment } = req.body;
    try {
      const result = await roomCommentModel.create({
        roomId,
        userId,
        comment,
      });

      responseJSON({
        res,
        status: 200,
        data: result,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async getDetailRoomComment(req, res) {
    const { room_comment_id } = req.params;
    try {
      const result = await roomCommentModel.findOne({
        where: {
          id: room_comment_id,
        },
      });

      responseJSON({
        res,
        status: 200,
        data: result,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message),
      });
    }
  }

  async getListRoomCommentByRoomId(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "booking_date",
      query = "",
    } = req.query;
    const { room_id } = req.params;
    const { limit, offset } = getPagination(page, size);

    try {
      const getListRoomComment = await roomCommentModel.findAndCountAll({
        where: {
          roomId: room_id,
        },
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getListRoomComment, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
}

module.exports = new controllerRoomComment();
