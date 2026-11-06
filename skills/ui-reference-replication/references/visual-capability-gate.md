# Mandatory Visual Capability Gate

## Purpose

UI Reference Replication promises to reproduce a supplied visual reference. Direct image perception is therefore a hard prerequisite, not an optional enhancement.

## Hard prerequisite

Before analyzing or modifying the target project, confirm that the current agent can:

1. Visually inspect the supplied reference image, screenshot, or rendered public page.
2. Visually inspect screenshots of its implementation at matching routes, viewport sizes, and UI states.
3. Compare the two sets of images and identify visible discrepancies.
4. Inspect the result again after corrections.

Merely creating a screenshot file, reading its path or metadata, parsing HTML/CSS/DOM, reading text descriptions, or calculating pixel differences does not satisfy this prerequisite.

## Mandatory rejection behavior

If the agent cannot inspect either the reference or its rendered output:

- Reject the Skill for this reference-reconstruction task.
- Do not begin a text-only approximation.
- Do not claim that the implementation matches the reference or is visually accurate.
- State exactly which visual capability is missing.
- Ask the user to use an agent/runtime that can directly inspect both reference and implementation images.

Use this refusal message, adapting only the missing capability:

> I cannot run UI Reference Replication in this agent because it cannot visually inspect [the reference / implementation screenshots]. Visual perception is mandatory for reference-matched reconstruction. No implementation has been started. Please use a vision-capable agent/runtime that can inspect both the reference and rendered output.

## What counts as visual capability

Accepted:
- The model can directly receive and interpret image inputs in the current session.
- The model can inspect screenshots returned by an authorized browser or image tool as visual content.

Not accepted:
- An image URL or local filepath that the agent cannot open and perceive.
- Screenshot capture that only saves files but does not make the images visually accessible.
- OCR, image captions, alt text, DOM/CSS, design tokens, computed styles, or pixel-difference numbers alone.
- A claim that a model or vendor is multimodal without confirming image access in the current session.

## Scope

This gate applies to reference-led UI implementation and visual comparison. A separately requested coding task based only on a written specification is a different task and must not be represented as a completed UI Reference Replication run.

Passing this gate only establishes that the agent has the required perception capability. It does not prove quality. The agent must still inspect both source and output, correct visible differences, verify important product behavior, and report unresolved issues honestly.
