---
trigger: always_on
---

# PRODUCT REQUIREMENTS: SurgeClaw 📋

## 1. The Product
**What:** CLI process manager for multiple OpenClaw instances.
**Who:** Founders, Agencies, Power Users.
**Why:** Running 1 openclaw is cool. Running 5 is a superpower.

## 2. The Features

### 2.1 The Magic Command
`surgeclaw onboard`
- Wizard: "How many agents? Roles? Security?"
- Result: 5 agents live in 10 seconds.

### 2.2 The Manager
`surgeclaw list`
- Visual status board (Live/Idle/Dead).
- Uptime & Task counters.

### 2.3 The Modes (Topology)
- **Shared:** Agents jam in one folder. Collaboration mode.
- **Isolated:** Agents walled off. Client mode.

## 3. Architecture ("The We Do Nothing Stack")
- **Language:** Node.js.
- **Mechanism:** Spawn `openclaw gateway` processes on ports 18789+.
- **State:** `~/.surgeclaw/state.json`.
- **Config:** Dynamic generation of standard `openclaw.json`.

## 4. Success Metrics
- **Time to Swarm:** < 60 seconds from install to 3 agents running.
- **Maintenance:** Zero code changes required for next OpenClaw update.
