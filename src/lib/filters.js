export function filterMenuItems(items, filters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesCategory = filters.category === "all" || item.category === filters.category;
    const matchesDiet = filters.diet === "all" || item.diet === filters.diet;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesDiet && matchesQuery;
  });
}
