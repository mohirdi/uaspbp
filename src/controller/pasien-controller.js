import pasienService from "../service/pasien-service.js";

const create = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const result = await pasienService.create(user, request);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const user = req.user;
        const pasienId = req.params.pasienId;
        const result = await pasienService.get(user, pasienId);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const user = req.user;
        const pasienId = req.params.pasienId;
        const request = req.body;
        request.id = pasienId;

        const result = await pasienService.update(user, request);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}


const remove = async (req, res, next) => {
    try {
        const user = req.user;
        const pasienId = req.params.pasienId;

        await pasienService.remove(user, pasienId);
        res.status(200).json({
            data: "OK"
        })
    } catch (e) {
        next(e);
    }
}


export default {
    create,
    get,
    update,
    remove,
}
