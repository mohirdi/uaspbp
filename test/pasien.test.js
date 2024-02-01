import {
    createManyTestPasiens,
    createTestPasien,
    createTestUser,
    getTestPasien,
    removeAllTestPasiens,
    removeTestUser
} from "./test-util.js";
import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

describe('POST /api/Pasiens', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestPasiens();
        await removeTestUser();
    });

    it('should be able to create a new Pasien', async () => {
        const result = await supertest(web)
            .post("/api/Pasiens")
            .set('Authorization', 'test')
            .send({
                namaPenyakit: "Test Pasien",
                keterangan: "This is a test Pasien",
                ruangan: 11,
                antrian: 14,
                kelamin: "Laki-laki",
                alamat: "Kp.Cibolang"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.namaPenyakit).toBe("Test Pasien");
        expect(result.body.data.keterangan).toBe("This is a test Pasien");
        expect(result.body.data.ruangan).toBe(11);
        expect(result.body.data.antrian).toBe(14);
        expect(result.body.data.kelamin).toBe("Laki-laki");
        expect(result.body.data.alamat).toBe("Kp.Cibolang");
    });

    it('should reject if the request is not valid', async () => {
        const result = await supertest(web)
            .post("/api/Pasiens")
            .set('Authorization', 'test')
            .send({
                namaPenyakit: "",
                ruangan: "invalid"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/Pasiens/:PasienId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestPasien();
    });

    afterEach(async () => {
        await removeAllTestPasiens();
        await removeTestUser();
    });

    // ...

    it('should be able to get Pasien', async () => {
        const testPasien = await getTestPasien();
    
        const result = await supertest(web)
            .get("/api/Pasiens/" + testPasien.id)
            .set('Authorization', 'test');
    
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testPasien.id);
        expect(result.body.data.namaPenyakit).toBe("Test Pasien");
        expect(result.body.data.keterangan).toBe("Test Description");
        expect(result.body.data.ruangan).toBe(11);
        expect(result.body.data.antrian).toBe(10);
        expect(result.body.data.kelamin).toBe("Test Color");
        expect(result.body.data.alamat).toBe("Test Category");
    });
    
    it('should return 404 if Pasien id is not found', async () => {
        const testPasien = await getTestPasien();
    
        const result = await supertest(web)
            .get("/api/Pasiens/" + (testPasien.id + 1))
            .set('Authorization', 'test');
    
        expect(result.status).toBe(404);
    });
});

describe('PUT /api/Pasiens/:PasienId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestPasien();
    });

    afterEach(async () => {
        await removeAllTestPasiens();
        await removeTestUser();
    });

    it('should be able to update an existing Pasien', async () => {
        const testPasien = await getTestPasien();

        const result = await supertest(web)
            .put('/api/Pasiens/' + testPasien.id)
            .set('Authorization', 'test')
            .send({
                namaPenyakit: "Updated Pasien",
                keterangan: "Updated description",
                ruangan: 12,
                antrian: 30,
                kelamin: "Blue",
                alamat: "kp.cisaat"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testPasien.id);
        expect(result.body.data.namaPenyakit).toBe("Updated Pasien");
        expect(result.body.data.keterangan).toBe("Updated description");
        expect(result.body.data.ruangan).toBe(12);
        expect(result.body.data.antrian).toBe(30);
        expect(result.body.data.kelamin).toBe("Blue");
        expect(result.body.data.alamat).toBe("kp.cisaat");
    });

    it('should reject if request is invalid', async () => {
        const testPasien = await getTestPasien();

        const result = await supertest(web)
            .put('/api/Pasiens/' + testPasien.id)
            .set('Authorization', 'test')
            .send({
                namaPenyakit: "",
                ruangan: "invalid"
            });

        expect(result.status).toBe(400);
    });

    it('should reject if Pasien is not found', async () => {
        const testPasien = await getTestPasien();

        const result = await supertest(web)
            .put('/api/Pasiens/' + (testPasien.id + 1))
            .set('Authorization', 'test')
            .send({
                namaPenyakit: "Updated Pasien",
                keterangan: "Updated description",
                ruangan: 12,
                antrian: 30,
                kelamin: "Blue",
                alamat: "kp.cisaat"
            });

        expect(result.status).toBe(404);
    });
});

describe('DELETE /api/Pasiens/:PasienId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestPasien();
    });

    afterEach(async () => {
        await removeAllTestPasiens();
        await removeTestUser();
    });

    it('should be able to delete Pasien', async () => {
        let testPasien = await getTestPasien();
        const result = await supertest(web)
            .delete('/api/Pasiens/' + testPasien.id)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        testPasien = await getTestPasien();
        expect(testPasien).toBeUndefined(); // Mengganti .toBeNull() dengan .toBeUndefined()
    });

    it('should reject if Pasien is not found', async () => {
        let testPasien = await getTestPasien();
        if (!testPasien) {
            // Jika produk tidak ditemukan, maka test akan langsung gagal
            fail('Test Pasien not found');
            return;
        }

        const result = await supertest(web)
            .delete('/api/Pasiens/' + (testPasien.id + 1))
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('GET /api/Pasiens', function () {
    beforeEach(async () => {
        await createTestUser();
        await createManyTestPasiens();
    });

    afterEach(async () => {
        await removeAllTestPasiens();
        await removeTestUser();
    });

    it('should be able to search without parameter', async () => {
        const result = await supertest(web)
            .get('/api/Pasiens')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should be able to search to page 2', async () => {
        const result = await supertest(web)
            .get('/api/Pasiens')
            .query({
                page: 2
            })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should be able to search using name', async () => {
        const result = await supertest(web)
            .get('/api/Pasiens')
            .query({
                namaPenyakit: "test 1"
            })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should be able to search using category', async () => {
        const result = await supertest(web)
            .get('/api/Pasiens')
            .query({
                alamat: "Kp.Cibolang"
            })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(5);
    });

    it('should be able to search using price range', async () => {
        const result = await supertest(web)
            .get('/api/Pasiens')
            .query({
                minPrice: 14,
                maxPrice: 11
            })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });
});
