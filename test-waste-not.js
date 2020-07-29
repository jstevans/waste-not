const { default: wastenot } = require("./dist/waste-not/lib/index");
const { performance, PerformanceObserver } = require("perf_hooks");
const config = {
  files: ["packages/**/*.*", "node_modules/**/*", "*.json", "*.lock"],
  tsConfig: "./tsconfig.json",
};

console.log("STARTED");

const obs = new PerformanceObserver((items) => {
  const entries = items.getEntriesByType("measure");

  console.log("\nTOP ENTRIES:");
  const topEntries = entries
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);
  topEntries.forEach((entry) =>
    console.log(`${entry.name} - ${entry.duration}`)
  );
  console.log(
    `top entries: ${topEntries
      .map((e) => e.duration)
      .reduce((acc, e) => acc + e)}`
  );

  const nmEntriesTime = entries
    .filter((e) => e.name.includes("node_modules"))
    .reduce((acc, e) => acc + e.duration, 0);
  console.log(`total processFile{node_modules}: ${nmEntriesTime}`);

  const repoEntriesTime = entries
    .filter((e) => !e.name.includes("node_modules"))
    .reduce((acc, e) => acc + e.duration, 0);
  console.log(`total processFile{repo}: ${repoEntriesTime}`);

  performance.clearMarks();
});

obs.observe({
  entryTypes: ["measure"],
  buffered: true,
});
const start = performance.now();
wastenot(config).then((a) => {
  const end = performance.now();
  console.log(`DONE IN ${end - start}ms`);
  debugger;
});

obs.disconnect();
