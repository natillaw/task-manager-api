const prisma = require('../config/prisma');

async function listProjects(req, res) {
  const projects = await prisma.project.findMany({
    where: { organizationId: req.user.organizationId },
  });
  res.json(projects);
}

async function createProject(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  const project = await prisma.project.create({
    data: {
      name,
      organizationId: req.user.organizationId,
    },
  });

  res.status(201).json(project);
}

async function updateProject(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const project = await prisma.project.update({
      where: { id, organizationId: req.user.organizationId },
      data: { name },
    });
    res.json(project);
  } catch (err) {
    res.status(404).json({ error: 'Proyecto no encontrado' });
  }
}

async function deleteProject(req, res) {
  const { id } = req.params;

  try {
    await prisma.project.delete({
      where: { id, organizationId: req.user.organizationId },
    });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: 'Proyecto no encontrado' });
  }
}

module.exports = { listProjects, createProject, updateProject, deleteProject };