import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // 1. ORGANIZACIÓN
  const organization = await prisma.organization.create({
    data: {
      name: "Tech Solutions",
    },
  });

  // 2. USUARIOS
  const admin = await prisma.user.create({
    data: {
      name: "Grace",
      email: "grace@techsolutions.com",
      password: "123456",
    },
  });

  const member1 = await prisma.user.create({
    data: {
      name: "Carlos",
      email: "carlos@techsolutions.com",
      password: "123456",
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: "Ana",
      email: "ana@techsolutions.com",
      password: "123456",
    },
  });

  // 3. MEMBERSHIPS
  await prisma.membership.create({
    data: {
      userId: admin.id,
      organizationId: organization.id,
      role: "ADMIN",
    },
  });

  await prisma.membership.create({
    data: {
      userId: member1.id,
      organizationId: organization.id,
      role: "MEMBER",
    },
  });

  await prisma.membership.create({
    data: {
      userId: member2.id,
      organizationId: organization.id,
      role: "MEMBER",
    },
  });

  // 4. PROYECTOS
  const webProject = await prisma.project.create({
    data: {
      name: "Página web corporativa",
      organizationId: organization.id,
    },
  });

  const apiProject = await prisma.project.create({
    data: {
      name: "API Task Manager",
      organizationId: organization.id,
    },
  });

  // 5. TAREAS
  await prisma.task.create({
    data: {
      title: "Crear página de inicio",
      description: "Diseñar y desarrollar la página principal.",
      dueDate: new Date("2026-10-01"),
      status: "IN_PROGRESS",
      projectId: webProject.id,
      assignedTo: member1.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Diseñar formulario de contacto",
      description: "Crear el formulario y validar los campos.",
      dueDate: new Date("2026-10-05"),
      status: "PENDING",
      projectId: webProject.id,
      assignedTo: member2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Crear endpoint de usuarios",
      description: "Implementar el CRUD de usuarios.",
      dueDate: new Date("2026-10-10"),
      status: "IN_PROGRESS",
      projectId: apiProject.id,
      assignedTo: member1.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Documentar API",
      description: "Preparar la documentación de los endpoints.",
      status: "PENDING",
      projectId: apiProject.id,
      assignedTo: null,
    },
  });

  await prisma.task.create({
    data: {
      title: "Probar autenticación",
      description: "Realizar pruebas del sistema de login.",
      status: "DONE",
      projectId: apiProject.id,
      assignedTo: admin.id,
    },
  });
 console.log("✅ Seed completado correctamente.");

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });