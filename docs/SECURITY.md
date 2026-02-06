# SurgeClaw Security & Safety 🛡️

SurgeClaw is built on the principle of **Zero-Footprint Orchestration.**

## 1. Protecting the King
SurgeClaw implements a **Hard Environment Barrier**. By default, it will never read or write to your primary `~/.openclaw` configuration file unless you are migrating your legacy "Master" agent.

## 2. Departmental Isolation
The primary security benefit of SurgeClaw is **Failure Isolation**.
- **Production Safety:** Keep your "Core" agent stable and untouched.
- **Innovation Sandbox:** Spin up "Testing" or "Scout" agents to experiment with new local models (quantized, job-specific) or experimental plugins.
- **Zero Bleed:** If a custom script or a new plugin crashes an experimental agent, your primary business workflows remain online.

## 3. Permission Granularity
While macOS grants permissions to the application (the `node` binary), SurgeClaw allows you to manage permissions at the **Agent Level** through the OpenClaw GUI. 
- Use the **Control UI** to toggle Screen Recording or Accessibility for specific agents while keeping your core agent fully "Granted."

## 4. Hardware Safety
SurgeClaw's **20-Port Spacing Rule** is an engineering requirement to prevent port collisions. This ensures that internal browser tools (CDP, Relay, Canvas) from different agents never attempt to bind to the same network resource.
