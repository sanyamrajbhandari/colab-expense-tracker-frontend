export const ALL_OPTION = "All";

export const buildMonthOptions = () => {
  const options = [ALL_OPTION];
  const now = new Date();
  for (let i = 0; i < 12; i += 1) {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
    );
    options.push(
      date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    );
  }
  return options;
};

export const parseMonthFilter = (monthLabel) => {
  if (!monthLabel || monthLabel === ALL_OPTION) return null;
  const [monthName, yearString] = monthLabel.split(" ");
  // Using a more robust date parsing for consistency
  const date = new Date(`${monthName} 1, ${yearString}`);
  if (isNaN(date.getTime())) return null;
  
  const month = date.getMonth() + 1;
  const year = Number(yearString);
  return { month, year };
};
