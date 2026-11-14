import assert from "node:assert/strict";
import test from "node:test";
import { normalizeProfileInput, ProfileInputError } from "../src/lib/profile-input.ts";

test("normalizes an Instagram username and @handle", () => {
  assert.deepEqual(normalizeProfileInput("instagram", "@public.name_1"), {
    platform: "instagram",
    username: "public.name_1",
    profileUrl: "https://www.instagram.com/public.name_1/",
  });
});

test("normalizes an Instagram profile URL and ignores query parameters", () => {
  assert.equal(
    normalizeProfileInput("instagram", "https://www.instagram.com/example/?hl=en").profileUrl,
    "https://www.instagram.com/example/",
  );
});

test("rejects Instagram post URLs and unsupported hosts", () => {
  assert.throws(
    () => normalizeProfileInput("instagram", "https://instagram.com/p/abc/"),
    ProfileInputError,
  );
  assert.throws(
    () => normalizeProfileInput("instagram", "https://instagram.com.attacker.example/user"),
    ProfileInputError,
  );
  assert.throws(
    () => normalizeProfileInput("instagram", "https://user:pass@instagram.com/user"),
    ProfileInputError,
  );
});

test("normalizes a LinkedIn public profile URL", () => {
  assert.deepEqual(normalizeProfileInput("linkedin", "https://www.linkedin.com/in/example-person/"), {
    platform: "linkedin",
    username: "example-person",
    profileUrl: "https://www.linkedin.com/in/example-person/",
  });
});

test("rejects invalid LinkedIn paths and non-profile URLs", () => {
  assert.throws(
    () => normalizeProfileInput("linkedin", "https://linkedin.com/company/example/"),
    ProfileInputError,
  );
  assert.throws(
    () => normalizeProfileInput("linkedin", "https://example.com/in/person"),
    ProfileInputError,
  );
});

test("rejects blank and malformed usernames", () => {
  assert.throws(() => normalizeProfileInput("instagram", "  "), ProfileInputError);
  assert.throws(() => normalizeProfileInput("instagram", "invalid/name"), ProfileInputError);
  assert.throws(() => normalizeProfileInput("linkedin", "ab"), ProfileInputError);
  assert.throws(() => normalizeProfileInput("toString", "sample"), ProfileInputError);
});
