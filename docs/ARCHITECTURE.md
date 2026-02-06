# SurgeClaw Architecture 🏛️

SurgeClaw is a thin, high-performance orchestrator for multi-instance OpenClaw swarms. It follows a **"Church and State"** separation model, ensuring that while agents share a machine, they share nothing else.

## 1. The Isolation Core
SurgeClaw achieves 100% process isolation through three primary primitives:

### A. Digital Cloaking (Environment Scoping)
Every agent spawned by SurgeClaw has its environment variables surgically overridden:
- `HOME`: Points to the agent's unique directory (e.g., `~/.openclaw/agents/Marketing`).
- `OPENCLAW_HOME`: Aligns with the new fake `HOME`.
- `OPENCLAW_CONFIG_PATH`: Directly targets the agent's specific `openclaw.json`.
- `OPENCLAW_STATE_DIR`: Points to the agent's unique state folder.

This "Cloak" forces OpenClaw's internal logic to believe its isolated cabinet is the entire file system.

### B. Path Confinement
SurgeClaw executes all child processes with a unique `cwd` (Current Working Directory) within the agent's cabinet. This prevents relative path leakage and ensures log files and temporary artifacts stay localized.

### C. Port Spacing (The 20-Port Rule)
OpenClaw derives several internal ports (CDP, Relay, Canvas) from the base Gateway port. SurgeClaw enforces a mandatory **20-port block** between agents:
- **Agent A (CEO):** Port 18789 (+1 to +19 reserved).
- **Agent B (Marketing):** Port 18809 (+1 to +19 reserved).

## 2. Process Lifecycle
SurgeClaw manages agents in two primary modes:
1. **Interactive Mode (`surgeclaw [name] [cmd]`):** Spawns a synchronous child process. Control returns only after the command completes.
2. **Persistence Mode (`surgeclaw start` / `swarm start`):** Spawns a **Detached Process**. The parent SurgeClaw process exits immediately, leaving the agent running independently in the background.

## 3. GUI Synergy
SurgeClaw uses the standard `~/.openclaw/agents` directory structure. This ensures that any agent created via the CLI is instantly visible and manageable via the official **OpenClaw Control UI** (Companion App), allowing for visual permission management and heartbeat monitoring.
