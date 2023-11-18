const Vocabulary = require("../model/vocabulary.js");
const asyncHandler = require("express-async-handler"); // không cần try-cath gì tự bắt lỗi

const vocabularyController = {
  createVoca: asyncHandler(async (req, res) => {
    const {id} = req.auth
    const {eng, vie} = req.body
    console.log('Check data backend','id', id,  'eng vie', eng, vie)
    if (!eng || !vie) {
        console.log('not full field')
        res.status(401).json({
            status: 1,
            mess: 'Bạn không  được bỏ trống thống tin từ vựng'
        })
    }
    else {
        const findVocaExist = await Vocabulary.findOne({eng})
        console.log('findVocaExist >>>>')
        if (findVocaExist) {
            console.log('exist')
            res.status(401).json({
                status: 1,
                mess: 'Từ vựng này đã tồn tại'
            })
        }
        else {
            const newVoca = await Vocabulary.create({user: id, ...req.body})
            console.log('add success >>>', newVoca)
            if (newVoca) {
                res.status(201).json({
                    status: 0,
                    mess: 'Thêm từ vựng thành công'
                })
            }
        }
    }
  }),
  getItemVoca: asyncHandler(async(req,res) => {
    const { eng } = req.params;
    const itemVoca = await Vocabulary.findOne({eng})
    // console.log('check itemVoca >>>>', itemVoca)
    if (itemVoca) {
        res.status(201).json({
            status: 0,
            mess: 'Lấy từ vựng thành công',
            data: itemVoca
        })
    }
    else {
        res.status(401).json({
            status: 1,
            mess: 'Không tồn tại từ vựng này trong từ điển',
        })
    }
  }),
  getAllVocaUser: asyncHandler(async(req, res) => {
    const {id} = req.auth
    const allVoca = await Vocabulary.find({user: id})
    console.log(allVoca)
    if (allVoca) {
        res.status(200).json({
            status: 0,
            mess: 'Lấy thành công danh sách tất cả từ vựng',
            data: allVoca
        })
    }
  }),
  listVocaLearn: asyncHandler (async(req, res) => {
    const {id} = req.auth
    const vocaLeaning = await Vocabulary.find({user: id, status: false})
    if (vocaLeaning) {
        res.status(200).json({
            status: 0,
            mess: 'Danh sách từ vựng chưa thuộc',
            data: vocaLeaning
        })
    }
  }),
  learnVoca: asyncHandler(async(req, res) => {
    const {eng} = req.params
    const {id} = req.auth
    const vocaCurrLearn = await Vocabulary.findOne({user: id, eng})
    // console.log('Voca current leaning >>>> ', vocaCurrLearn)
    if (vocaCurrLearn) {
        console.log('vocaCurrLearn.progress voca ', eng, 'is >>>', vocaCurrLearn.progress)
        if (+vocaCurrLearn.progress < 10) {
            const learingVoca = await Vocabulary.findOneAndUpdate({user: id, eng}, {progress: +vocaCurrLearn.progress + 1})
            res.status(201).json({
                status: 0,
                mess: 'Bạn đang học từ vựng này',
                data: learingVoca
            })
        }
        else if (+vocaCurrLearn.progress === 10) {
            const learingVoca = await Vocabulary.findOneAndUpdate({user: id, eng}, {status: true})
            res.status(201).json({
                status: 0,
                mess: 'Bạn đã hoàn thành vựng này',
                data: learingVoca
            })
        }
        else {
            res.status(400).json({
                status: 1,
                mess: 'Bạn đã hoàn thành',
            })
        }
    }
    else {
        res.status(200).json({
            status: 1,
            mess: 'Từ vựng này không tồn tại',
        })
    }
  }),
  deleteVoca: asyncHandler(async(req, res) => {
    const {eng} = req.params
    const {id} = req.auth
    if (eng && id) {
        const deleteVoca = await Vocabulary.findOneAndDelete({eng, user: id})
        if (deleteVoca) {
            res.status(200).json({
                status: 0,
                mess: 'Xóa từ vựng này thành công',
            })
        }
    }
  }), 
  allVocaLearnFinish: asyncHandler(async(req, res) => {
    const {id} = req.auth
    const allVocaFinish = await Vocabulary.find({user: id, status: true})
    if (allVocaFinish) {
        res.status(200).json({
            status: 0,
            mess: 'Lấy thông tin từ đã học thành công',
            data: allVocaFinish
        })
    }
  })
};

module.exports = vocabularyController;
