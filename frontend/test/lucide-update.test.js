import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as lucideIcons from "lucide-react";

const frontendRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

test("lucide-react is resolved to 1.83.0 in the lockfile", () => {
  const lock = JSON.parse(
    fs.readFileSync(path.join(frontendRoot, "package-lock.json"), "utf8"),
  );

  assert.equal(lock.packages["node_modules/lucide-react"].version, "1.83.0");
});

test("every lucide icon used by the app is still exported", () => {
  // Names imported across frontend/src. None of the lab icons removed in
  // lucide-react 1.83.0 (burger, card-credit, football, pac-man-ghost,
  // bowl-chopsticks) are used here.
  const iconsUsedByApp = [
    "AlertTriangle",
    "ArrowRight",
    "BarChart3",
    "Boxes",
    "Building2",
    "Check",
    "Download",
    "Eye",
    "EyeOff",
    "FileText",
    "IndianRupee",
    "Landmark",
    "LayoutDashboard",
    "LogOut",
    "Menu",
    "Package",
    "Pencil",
    "Plus",
    "RefreshCcw",
    "Search",
    "Tag",
    "Trash2",
    "Upload",
    "X",
  ];

  for (const icon of iconsUsedByApp) {
    assert.notEqual(
      typeof lucideIcons[icon],
      "undefined",
      `${icon} must remain exported by lucide-react`,
    );
  }
});
