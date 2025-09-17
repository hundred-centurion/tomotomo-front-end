const getClassName = (value: number) => {
  if (value >= 10 && value < 12) {
    return 'bg-gray-900';
  } else if (value >= 8 && value < 10) {
    return 'bg-gray-800';
  } else if (value >= 6 && value < 8) {
    return 'bg-gray-700';
  } else if (value >= 4 && value < 6) {
    return 'bg-gray-600';
  } else if (value >= 2 && value < 4) {
    return 'bg-gray-500';
  } else if (value >= 0 && value < 2) {
    return 'bg-gray-400';
  } else {
    return 'bg-none';
  }
};

export const makeCalendarHeatMap = (heatMap: Record<string, number>) => {
  const obj: Record<string, string> = {};

  Object.entries(heatMap).map(([key, value]) => (obj[key] = getClassName(value)));

  return obj;
};
