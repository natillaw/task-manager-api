### Decisiones del modelo de datos

La relación entre usuarios y organizaciones es de **muchos a muchos**:

```text
👤 User                    🏢 Organization
   │                              │
   │                              │
   └───────── 🔗 Membership ──────┘
                    │
                    └── role

El modelo de la base de datos fue diseñado pensando en las relaciones que existen dentro de un sistema de gestión de proyectos. 

Se utilizó `Membership` como tabla puente entre `User` y `Organization`, ya que un usuario puede pertenecer a diferentes organizaciones y una organización puede tener varios usuarios. 

Además, `Membership` permite almacenar información específica de esa relación, como el rol que tiene el usuario dentro de la organización (`ADMIN` o `MEMBER`).

Membership
├── userId
├── organizationId
└── role
      ├── ADMIN
      └── MEMBER

Se utilizaron enums para los campos `role` y `status` porque sus valores están limitados a opciones específicas. De esta manera, se evita almacenar valores diferentes a los permitidos, manteniendo los datos consistentes.

👤 Role
├── ADMIN
└── MEMBER

📋 TaskStatus
├── PENDING
├── IN_PROGRESS
└── DONE

En `Task`, el campo `assignedTo` es opcional porque una tarea puede crearse antes de asignarla a un usuario. De la misma forma, `description` y `dueDate` son opcionales porque no todas las tareas necesariamente tienen una descripción detallada o una fecha límite desde el momento de su creación. Esto permite que el sistema sea más flexible y represente situaciones reales del flujo de trabajo.

📋 Task
├── title          → obligatorio
├── status         → obligatorio
├── projectId      → obligatorio
├── assignedTo     → opcional
├── description    → opcional
└── dueDate        → opcional
