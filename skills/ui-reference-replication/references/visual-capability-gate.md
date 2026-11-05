# Mandatory Visual Capability Gate

## Purpose

UI Reference Replication is a visual reconstruction skill. A successful implementation must be evaluated against the actual appearance and motion of the supplied reference. Therefore, image/video perception is a hard prerequisite, not an optional enhancement.

## Hard prerequisite

Before analyzing or modifying the target project, confirm that the current agent can:

1. Visually inspect the supplied reference image, screenshot, or rendered reference website.
2. Visually inspect screenshots of its own implementation at matching routes, viewport sizes, and UI states.
3. Inspect visual states of motion/effects, using an accessible recording or a sequence of captured frames when animation is in scope.
4. Compare the reference and implementation perceptually, identify visible discrepancies, and verify corrections after recapture.

The perception capability must be available to the agent in the current execution context. Merely creating a screenshot file, reading its path or metadata, parsing HTML/CSS/DOM, reading Figma node data, calculating pixel differences, or receiving a textual summary of an image does **not** satisfy this prerequisite.

## Mandatory rejection behavior

If any required visual-perception capability is unavailable:

- **Reject this Skill for the requested reference-reconstruction task.**
- Do not begin a text-only approximation under the name UI Reference Replication.
- Do not claim the result can match the reference image, is visually accurate, or represents the best visual result.
- Do not treat DOM geometry, computed styles, token values, or pixel-difference percentages as substitutes for perceptual review.
- State exactly which visual capability is missing.
- Ask the user to run the task in an agent/runtime that can directly inspect both the reference and implementation visuals, including motion captures when required.

Use this refusal message, adapting only the missing capability:

> I cannot run UI Reference Replication in this agent because it cannot visually inspect [the reference / implementation screenshots / motion captures]. Visual perception is mandatory for reference-matched reconstruction. No implementation has been started. Please use a vision-capable agent/runtime that can inspect both the reference and rendered output.

## What counts as visual capability

Accepted:
- The model can directly receive and visually interpret image inputs in the current conversation/runtime.
- The model can directly inspect screenshots returned by an authorized browser or image tool as visual content.
- For motion tasks, the model can inspect the relevant video recording or a sequence of actual captured frames from the animation.

Not accepted:
- An image URL or local filepath that the agent cannot open and perceive.
- Screenshot capture that only saves files but does not make the images visually accessible to the agent.
- OCR output, image captions, alt text, DOM/CSS, design tokens, computed styles, Figma metadata, or pixel-diff numbers alone.
- A claim that a model or vendor is "multimodal" without confirming that image inputs and generated screenshots are accessible in the current session.

## Scope

This gate applies to the core promise of reconstructing a reference image, screenshot, rendered site, or its motion. A separately requested coding task based only on a written specification is a different task and must not be represented as a completed UI Reference Replication run.

Passing this gate only establishes that the agent has the required perception capability. It does not prove quality. The agent must still inspect both source and output, execute the visual correction loop, test functionality/accessibility/responsiveness/performance, and report unresolved differences honestly.


## Evidence record and integrity

For every reference-to-implementation comparison used as delivery evidence, create a structured manifest using `templates/visual-evidence.example.json`. Validate it with:

```bash
node <skill>/scripts/validate-visual-evidence.mjs --file artifacts/ui-reference/visual-evidence.json --root .
```

The validator checks that each evidence pair has a route, state, viewport, accessible PNG files, matching image dimensions, SHA-256 hashes, and a completed review declaration covering both images. A missing or unreviewed pair fails the evidence gate.

**Integrity limitation:** this validator proves file existence, pairing, dimensions, hashes, and completeness of the declared review record. It cannot prove that a model actually perceived or correctly interpreted the images. The review is explicitly labelled `agent-declared`; the mandatory visual-capability rule remains in force.
