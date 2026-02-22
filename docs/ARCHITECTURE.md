# SurgeClaw Architecture 🦞🏗️

SurgeClaw is designed as a **Thin Orchestration Layer** that magnifies OpenClaw without interfering with its core logic. It uses a "Shadow Environment" pattern to achieve multi-tenancy on a single machine.

---

## 🏛️ The "Landlord" Model
SurgeClaw acts as the **Landlord**. It provides the building (the machine), the utilities (the ports), and the security (the permissions), but it never interacts with the **Tenant** (the OpenClaw Soul) directly.

![Diagram](../assets/ARCHITECTURE_diagram_1.svg)

---

## 🛡️ Three-Layer Isolation

### 1. Environmental Cloaking
SurgeClaw overrides standard Node.js environment variables to trick OpenClaw into thinking its isolated cabinet is the root of the system.
- `HOME`: Pointed to the instance's unique folder.
- `OPENCLAW_HOME`: Overridden to isolate configuration files.
- `OPENCLAW_STATE_DIR`: Decoupled from other instances.

### 2. Port Spacing (The 150 Rule)
To prevent WebSocket and browser-tool collisions, SurgeClaw reserves a mandatory **150-port safe block** for every OpenClaw instance.
- Instance A: 18960 -> 19110
- Instance B: 19110 -> 19260
- This ensures Canvas, Browser Relay, and CDP signals never cross-pollinate.

### 3. Path Confinement
Every command is executed from a unique `cwd` (Current Working Directory) within the instance's root folder. This prevents relative-path data leaks.

---

## 🛠️ Interactivity: The Sub-shell Pattern
The `configure` command spawns a child process with an injected environment. This allows users to use native `openclaw` commands directly.

![Diagram](../assets/ARCHITECTURE_diagram_2.svg)

---

## 📜 Data Sovereignty
SurgeClaw follows a **STRICT isolation policy**. It never reads or modifies your primary `~/.openclaw` directory. This ensures that even if you use SurgeClaw to manage 100 experimental OpenClaws, your primary "King" instance remains untouched and secure.
