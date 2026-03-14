let counsellingDataPromise;

export function loadCounsellingData() {
  if (!counsellingDataPromise) {
    counsellingDataPromise = fetch("/data/counselling-data.json").then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load counselling data");
      }

      return response.json();
    });
  }

  return counsellingDataPromise;
}

export function estimateChance(rank, closingRank) {
  if (!rank || !closingRank) {
    return "Low";
  }

  if (rank <= closingRank * 0.85) {
    return "High";
  }

  if (rank <= closingRank) {
    return "Medium";
  }

  return "Low";
}

export function formatRank(value) {
  if (value == null || Number.isNaN(Number(value))) {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: Number(value) % 1 === 0 ? 0 : 2,
  }).format(Number(value));
}

export function buildChartPoints(rows) {
  if (!rows.length) {
    return [0];
  }

  const maxValue = Math.max(...rows.map((row) => row.closing_rank), 1);
  return rows.map((row) => Math.max(4, Math.round((row.closing_rank / maxValue) * 100)));
}
