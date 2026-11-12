// self-check: npx tsx scripts/check-dataset-csv.ts
import assert from "node:assert/strict";
import { parseDatasetCsv } from "../lib/event-dataset";

assert.deepEqual(parseDatasetCsv('﻿category,count\r\nRoboMission,42\n"Sumo, Senior","1,234"\n\n'), [
  { category: "RoboMission", count: 42 },
  { category: "Sumo, Senior", count: 1234 },
]);
assert.throws(() => parseDatasetCsv("A,1\nB,abc"));
assert.throws(() => parseDatasetCsv("category,count"));
console.log("ok");
