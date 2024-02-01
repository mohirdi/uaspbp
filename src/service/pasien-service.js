// pasien-service.js
import { validate } from "../validation/validation.js";
import {
    createpasienValidation,
    getpasienValidation,
    updatepasienValidation
} from "../validation/pasien-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const create = async (user, request) => {
    const pasien = validate(createpasienValidation, request);
    pasien.username = user.username;

    return prismaClient.pasien.create({
        data: pasien,
        select: {
            id: true,
            namaPenyakit: true,
            keterangan: true,
            ruangan: true,
            antrian: true,
            kelamin: true,
            alamat: true
        }
    });
}

const get = async (user, pasienId) => {
    pasienId = validate(getpasienValidation, pasienId);

    const pasien = await prismaClient.pasien.findFirst({
        where: {
            username: user.username,
            id: pasienId
        },
        select: {
            id: true,
            namaPenyakit: true,
            keterangan: true,
            ruangan: true,
            antrian: true,
            kelamin: true,
            alamat: true
        }
    });

    if (!pasien) {
        throw new ResponseError(404, "pasien is not found");
    }

    return pasien;
}

const update = async (user, request) => {
    const pasien = validate(updatepasienValidation, request);

    const totalpasienInDatabase = await prismaClient.pasien.count({
        where: {
            username: user.username,
            id: pasien.id
        }
    });

    if (totalpasienInDatabase !== 1) {
        throw new ResponseError(404, "pasien is not found");
    }

    return prismaClient.pasien.update({
        where: {
            id: pasien.id
        },
        data: {
            namaPenyakit: pasien.namaPenyakit,
            keterangan: pasien.keterangan,
            ruangan: pasien.ruangan,
            antrian: pasien.antrian,
            kelamin: pasien.kelamin,
            alamat: pasien.alamat
        },
        select: {
            id: true,
            namaPenyakit: true,
            keterangan: true,
            ruangan: true,
            antrian: true,
            kelamin: true,
            alamat: true
        }
    })
}

const remove = async (user, pasienId) => {
    pasienId = validate(getpasienValidation, pasienId);

    const totalInDatabase = await prismaClient.pasien.count({
        where: {
            username: user.username,
            id: pasienId
        }
    });

    if (totalInDatabase !== 1) {
        throw new ResponseError(404, "pasien is not found");
    }

    return prismaClient.pasien.delete({
        where: {
            id: pasienId
        }
    });
}

export default {
    create,
    get,
    update,
    remove
}
