# Benchmark Protocol and Agent Compatibility

## Controlled benchmark

Record a stable scenario ID and fixture ID covering the same prompt, reference material, project commit, routes, test data, and required states. Record work mode, fidelity, agent, model, runtime, Skill version, timestamp, visual review, functional regression, critical defect count, and measured resource usage.

Run at least three independent repetitions per side and compare medians. Keep agent/model/runtime and measurement source constant when comparing Skill versions.

## Usage provenance

- `provider-runtime` or `host-runtime`: values were exposed by that runtime and may be compared.
- `estimated`: disclose the estimate; never use it as measured savings.
- `unavailable`: keep values null, not zero.

Actual cost is comparable only when provider/host reports it for both sides with the same source. Do not infer actual cost from a public price card.

```bash
npm run benchmark:validate -- --file artifacts/ui-reference/benchmark.json --root .
npm run benchmark:compare -- --baseline artifacts/ui-reference/baseline-benchmark.json --candidate artifacts/ui-reference/candidate-benchmark.json --minimum-runs 3 --root .
```

The `compare` command validates both input reports before calculating savings. Both report paths must be relative to `--root`; evidence paths inside each report are resolved against the same root. Comparison is blocked if either report has schema errors, invalid measured token counts, missing evidence, or evidence paths outside the root. The JSON result includes validation results for both sides.

Savings are withheld unless both sides pass visual review, functional regression, and zero-critical-defect checks. Quality regression blocks token/cost savings claims.

## Agent compatibility

Start from the empty matrix template. Record agent/model/runtime/Skill version, test date, installation evidence, and separate results for visual input, browser, terminal, file writing, Figma MCP, and motion review.

```bash
npm run compatibility:validate -- --file artifacts/ui-reference/agent-compatibility.json --root .
```

An agent is fully compatible only when installation and visual-input, browser, terminal, and file-write tests all pass. Installation success alone is partial compatibility. Figma MCP and motion remain separate capabilities.

## Limits

Validators check declared data and evidence files. They cannot independently verify provider billing, actual model perception, benchmark fairness, or agent behavior over time. Preserve raw reports and disclose variance, browser/device conditions, and unavailable metrics. No savings percentage may be claimed without measured comparable runs.
