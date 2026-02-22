# SurgeClaw FAQ 🦞⚡

### Q: Why does my agent ask to run `openclaw gateway install`?
**A:** Swarm agents are managed by **SurgeClaw**, not by the Mac's system services.
- **Answer is NO:** Do not let the agent run that command. It will clash with your other offices.
- **The SurgeClaw Way:** Use `surgeclaw start <name>` or `surgeclaw swarm start` from your main terminal.

### Q: What is "Enterprise Mode"?
**A:** Choosing **Enterprise** during onboarding activates **SurgeClaw Sentinel**. It locks down your agent folders with strict UNIX permissions (700/600) and starts a tamper-proof **Audit Ledger** at `~/.surgeclaw/audit.log` for corporate compliance.

### Q: Does SurgeClaw read my private AI data?
**A:** No. SurgeClaw acts as a **Landlord**. It manages the environment (ports, folders, and permissions) but it never "steps inside" to read your conversations or API keys unless you explicitly step into the office yourself via `surgeclaw configure`.

### Q: Why the 150-port spacing?
**A:** Modern AI agents use multiple side-channels (Canvas, Browser Relay, CDP). A 150-port buffer ensures that even a swarm of 50 agents will never have a network signal collision on a single machine.

### Q: How do I tell my agent it is part of a Swarm?
**A:** You can send this "Swarm Awareness" prompt to any agent:
> "Julian, you are currently operating as part of the **SurgeClaw Swarm**. Your environment is fully isolated. I will handle your persistence and lifecycle using the SurgeClaw orchestrator. You just focus on your mission!"

### Q: How do I initialize my agent's soul?
**A:** Once you have stepped into the office via `surgeclaw configure <name>`, run:
`openclaw onboard`

### Q: How do I use Gemini CLI as my model provider?
**A:** To use cost-saving Gemini CLI OAuth while inside the agent's Office:
1. `openclaw plugins enable google-gemini-cli-auth`
2. `openclaw models auth login --provider google-gemini-cli --set-default`
