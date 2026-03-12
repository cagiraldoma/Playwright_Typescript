# Skill Registry — playwright_typescript

## User-Level Skills (`~/.claude/skills/`)

| Skill | Path | Trigger |
|-------|------|---------|
| go-testing | `~/.claude/skills/go-testing/SKILL.md` | Writing Go tests, using teatest, adding test coverage |
| skill-creator | `~/.claude/skills/skill-creator/SKILL.md` | Creating new skills, adding agent instructions, documenting patterns for AI |

> SDD skills (sdd-init, sdd-explore, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive) are orchestrator-invoked — not loaded by sub-agents directly.

## Project-Level Skills

None found.

## Project Convention Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project conventions, architecture, POM patterns, gotchas |

## How Sub-Agents Use This Registry

1. Search engram: `mem_search(query: "skill-registry", project: "playwright_typescript")`
2. Fallback: read `.atl/skill-registry.md`
3. Match task context to triggers above
4. Read the matching SKILL.md before writing any code
