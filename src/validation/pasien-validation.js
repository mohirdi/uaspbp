import Joi from "joi";

const createpasienValidation = Joi.object({
    namaPenyakit: Joi.string().max(100).required(),
    keterangan: Joi.string().max(255).optional(),
    ruangan: Joi.number().required(),
    antrian: Joi.number().integer().required(),
    kelamin: Joi.string().max(50).optional(),
    alamat: Joi.string().max(50).optional()
});

const getpasienValidation = Joi.number().positive().required();

const updatepasienValidation = Joi.object({
    id: Joi.number().positive().required(),
    namaPenyakit: Joi.string().max(100).required(),
    keterangan: Joi.string().max(255).optional(),
    ruangan: Joi.number().required(),
    antrian: Joi.number().integer().required(),
    kelamin: Joi.string().max(50).optional(),
    alamat: Joi.string().max(50).optional()
});

export {
    createpasienValidation,
    getpasienValidation,
    updatepasienValidation
}
