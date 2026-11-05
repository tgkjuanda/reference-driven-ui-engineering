import test from "node:test";
import assert from "node:assert/strict";
import { validateReview } from "../skills/ui-reference-replication/scripts/validate-visual-review.mjs";

const evidence = {
  schemaVersion: "1.0.0",
  task: { id: "task-1" },
  captures: [{
    id: "capture-1",
    route: "/dashboard",
    state: "default",
    visualReview: {
      status: "reviewed",
      inspectedReference: true,
      inspectedImplementation: true
    }
  }]
};

function dimensions(names, status = "pass") {
  return names.map(name => ({
    name, status,
    observation: `Reviewed ${name} in the paired screenshots.`,
    ...(status === "partial" || status === "fail" ? { evidence: "visible heading defect", action: "correct heading spacing" } : {}),
    ...(status === "not-tested" ? { reason: "No responsive environment was available." } : {})
  }));
}

function baseReview(fidelity = "reference-faithful") {
  const names = fidelity === "reference-faithful"
    ? ["geometry","hierarchy","typography","spacing","color","components","responsive","composition","reference-fidelity"]
    : ["geometry","hierarchy","typography","spacing","color","components","responsive","composition","design-anchors","product-fit","originality","anti-slop"];
  return {
    schemaVersion: "1.0.0",
    task: { id: "task-1", fidelity },
    reviews: [{
      captureId: "capture-1",
      route: "/dashboard",
      state: "default",
      attestation: "agent-declared",
      reviewer: "test-agent",
      reviewedAt: "2026-11-05T10:00:00.000Z",
      summary: "Visual review covers all required dimensions.",
      dimensions: dimensions(names)
    }]
  };
}

test("reference-faithful review passes when every required dimension is reviewed", () => {
  const report = validateReview(baseReview(), evidence);
  assert.equal(report.status, "pass");
  assert.equal(report.summary.fail, 0);
  assert.equal(report.summary.notTested, 0);
});

test("missing a required dimension fails the review gate", () => {
  const review = baseReview();
  review.reviews[0].dimensions = review.reviews[0].dimensions.filter(item => item.name !== "spacing");
  const report = validateReview(review, evidence);
  assert.equal(report.status, "fail");
  assert.ok(report.errors.some(item => item.message.includes("Missing required dimension: spacing")));
});

test("partial or untested dimensions cannot be reported as full pass", () => {
  const review = baseReview();
  review.reviews[0].dimensions[2] = {
    name: "typography", status: "partial",
    observation: "The title wraps one line too early.",
    evidence: "Screenshot title region",
    action: "Adjust font metrics and recapture."
  };
  const report = validateReview(review, evidence);
  assert.equal(report.status, "partial");
  assert.equal(report.summary.partial, 1);
});

test("creative mode requires anchors, product fit, originality, and anti-slop review", () => {
  const review = baseReview("reference-inspired-creative");
  const report = validateReview(review, evidence);
  assert.equal(report.status, "pass");
  const incomplete = baseReview("reference-inspired-creative");
  incomplete.reviews[0].dimensions = incomplete.reviews[0].dimensions.filter(item => item.name !== "anti-slop");
  const failed = validateReview(incomplete, evidence);
  assert.equal(failed.status, "fail");
  assert.ok(failed.errors.some(item => item.message.includes("Missing required dimension: anti-slop")));
});

test("review must reference a capture in the visual evidence manifest", () => {
  const review = baseReview();
  review.reviews[0].captureId = "missing-capture";
  const report = validateReview(review, evidence);
  assert.equal(report.status, "fail");
  assert.ok(report.errors.some(item => item.message.includes("does not exist")));
});

test("review route and state must match the evidence pair", () => {
  const review = baseReview();
  review.reviews[0].route = "/settings";
  const report = validateReview(review, evidence);
  assert.equal(report.status, "fail");
  assert.ok(report.errors.some(item => item.message.includes("route does not match")));
});
