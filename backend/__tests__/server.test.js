"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../src/routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', routes_1.default);
describe('Server', () => {
    it('should respond with health check', async () => {
        const response = await (0, supertest_1.default)(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
    });
    it('should have auth routes', async () => {
        const response = await (0, supertest_1.default)(app).post('/api/auth/register');
        expect(response.status).toBeGreaterThanOrEqual(400);
    });
    it('should have coins routes', async () => {
        const response = await (0, supertest_1.default)(app).get('/api/coins');
        expect(response.status).toBe(200);
    });
});
//# sourceMappingURL=server.test.js.map