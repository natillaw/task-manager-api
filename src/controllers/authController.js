const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

async function register(req, res) {
  const { email, password, name, organizationName } = req.body;

  if (!email || !password || !name || !organizationName) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        memberships: {
          create: {
            role: 'ADMIN',
            organization: {
              create: { name: organizationName },
            },
          },
        },
      },
      include: { memberships: { include: { organization: true } } },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      organization: user.memberships[0].organization.name,
    });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Ese email ya esta registrado' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { memberships: true },
  });

  if (!user) {
    return res.status(401).json({ error: 'Credenciales invalidas' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Credenciales invalidas' });
  }

  const membership = user.memberships[0];

  const token = jwt.sign(
    {
      userId: user.id,
      organizationId: membership.organizationId,
      role: membership.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ token });
}

module.exports = { register, login };