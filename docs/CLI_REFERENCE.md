# SurgeClaw CLI Reference 🦞⚡

The CLI is designed to be high-signal and non-intrusive. It routes commands to specific agents or manages the swarm as a whole.

---

## Swarm Management
Commands that affect the entire organization.

| Command | Description |
| :--- | :--- |
| `surgeclaw list` | Visual status board of all registered agents and their ports. |
| `surgeclaw status` | Heartbeat check to see which agents are initialized and live. |
| `surgeclaw swarm start` | Launches EVERY registered agent as a persistent background process. |
| `surgeclaw swarm stop` | Terminates all running agent processes in the kingdom. |
| `surgeclaw uninstall` | Completely dismantle the kingdom (Ghost or Nuclear options). |

---

## Agent Onboarding

| Command | Description |
| :--- | :--- |
| `surgeclaw onboard` | Launches the interactive wizard with Sentinel security choices. |
| `surgeclaw onboard -n <name> -r <role> -m <mode>` | Shortcut to create an agent with specific credentials. Mode can be `personal` or `enterprise`. |

---

## Agent Operations
Commands targeted at a specific agent cabinet.

| Command | Description |
| :--- | :--- |
| `surgeclaw logs [name]` | **Matrix View:** Stream real-time heartbeat logs for a specific agent. |
| `surgeclaw start [name]` | Deploys a specific agent to the background (Persistence Mode). |
| `surgeclaw stop [name]` | Safely terminates a specific background agent instance. |
| `surgeclaw offboard [name]` | Retire an agent and decommission their cabinet (with optional wipe). |
| `surgeclaw configure [name]` | **The Office:** Step inside an agent's fully isolated sub-shell. |

---

## The Intelligent Picker
If you run a generic command like `surgeclaw logs` without providing a name, SurgeClaw will present an interactive list of your agents to choose from on the fly.

## Port Isolation Policy
SurgeClaw enforces a mandatory **150-port safe block** per instance. This prevents background browser tool collisions and ensures absolute network signal isolation for every agent in your swarm.
