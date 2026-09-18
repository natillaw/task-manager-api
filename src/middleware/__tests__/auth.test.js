const jwt = require('jsonwebtoken');
const { verifyToken, requireRole } = require('../auth');

function crearMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
beforeAll(() => {
  process.env.JWT_SECRET = 'clave-de-prueba';
});
describe('verifyToken', () => {
  test('deja pasar la peticion si el token es valido', () => {
    const tokenValido = jwt.sign({ userId: 1, role: 'ADMIN' }, process.env.JWT_SECRET);

    const req = { headers: { authorization: `Bearer ${tokenValido}` } };
    const res = crearMockRes();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(expect.objectContaining({ userId: 1, role: 'ADMIN' }));
  });
});