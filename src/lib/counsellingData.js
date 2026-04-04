const datasetUrlByType = {
  ug: "/data/counselling-data-ug.json",
  pg: "/data/counselling-data.json",
};

const counsellingDataPromises = new Map();

export function loadCounsellingData(datasetType = "ug") {
  const datasetUrl = datasetUrlByType[datasetType] ?? datasetUrlByType.ug;

  if (!counsellingDataPromises.has(datasetUrl)) {
    counsellingDataPromises.set(datasetUrl, fetch(datasetUrl).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load counselling data");
      }

      return response.json();
    }));
  }

  return counsellingDataPromises.get(datasetUrl);
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
