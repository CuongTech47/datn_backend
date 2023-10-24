const mongoose = require('mongoose');

describe('MongoDB Connection', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/shopDev', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should connect to MongoDB', () => {
        expect(mongoose.connection.readyState).toBe(1);
    });
});