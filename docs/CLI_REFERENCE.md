# SurgeClaw CLI Reference 🦞⚡

The CLI is designed to be high-signal and non-intrusive. It routes commands to specific agents or manages the swarm as a whole.

---

## Swarm Management
Commands that affect the entire organization.

| Command | Description |
| :--- | :--- |
| `surgeclaw list` | Visual status board of all registered OpenClaw instances and their ports. |
| `surgeclaw status` | Heartbeat check to see which instances are initialized and live. |
| `surgeclaw swarm start` | Launches EVERY registered instance as a persistent background process. |
| `surgeclaw swarm stop` | Terminates all running instance processes in the kingdom. |
| `surgeclaw uninstall` | Completely dismantle the kingdom (Ghost or Nuclear options). |

---

## Instance Onboarding

| Command | Description |
| :--- | :--- |
| `surgeclaw onboard` | Launches the interactive wizard with Sentinel security choices. |
| `surgeclaw onboard -n <name> -r <role> -m <mode>` | Shortcut to create an instance with specific credentials. Mode can be `personal` or `enterprise`. |

---

## Instance Operations
Commands targeted at a specific instance cabinet.

| Command | Description |
| :--- | :--- |
| `surgeclaw logs [name]` | **Matrix View:** Stream real-time heartbeat logs for a specific instance. |
| `surgeclaw start [name]` | Deploys a specific instance to the background (Persistence Mode). |
| `surgeclaw stop [name]` | Safely terminates a specific background instance. |
| `surgeclaw offboard [name]` | Retire an instance and decommission their cabinet (with optional wipe). |
| `surgeclaw configure [name]` | **The Office:** Step inside an instance's fully isolated sub-shell. |

---

## The Intelligent Picker
If you run a generic command like `surgeclaw logs` without providing a name, SurgeClaw will present an interactive list of your instances to choose from on the fly.

## Port Isolation Policy
SurgeClaw enforces a mandatory **150-port safe block** per instance. This prevents background browser tool collisions and ensures absolute network signal isolation for every instance in your swarm.
