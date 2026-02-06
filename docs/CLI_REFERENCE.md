# SurgeClaw CLI Reference 🦞⚡

The CLI is designed to be high-signal and non-intrusive. It routes commands to specific agents or manages the swarm as a whole.

## Swarm Management
Commands that affect the entire organization.

| Command | Description |
| :--- | :--- |
| `surgeclaw list` | Visual status board of all registered agents and their ports. |
| `surgeclaw status` | Heartbeat check to see which agents are initialized and live. |
| `surgeclaw swarm start` | Launches EVERY registered agent as a persistent background process. |
| `surgeclaw swarm stop` | Terminates all running agent processes in the kingdom. |

## Agent Onboarding
| Command | Description |
| :--- | :--- |
| `surgeclaw onboard` | Launches the interactive wizard to create a new agent office. |
| `surgeclaw onboard -n <name> -r <role>` | Shortcut to create an agent with specific credentials. |

## Agent Operations
Commands targeted at a specific agent cabinet.

| Command | Description |
| :--- | :--- |
| `surgeclaw [name] setup` | Hands over to the native OpenClaw setup wizard for that specific soul. |
| `surgeclaw [name] gateway` | Runs the WebSocket gateway for that agent in the current terminal. |
| `surgeclaw start [name]` | Deploys a specific agent to the background (Persistence Mode). |
| `surgeclaw stop [name]` | Safely terminates a specific background agent. |
| `surgeclaw configure [name]` | **Configure Mode:** Spawns a sub-shell pre-loaded with the agent's environment. |

## The Intelligent Picker
If you run a generic command like `surgeclaw gateway` without providing a name, SurgeClaw will present an interactive list of your agents to choose from on the fly.
