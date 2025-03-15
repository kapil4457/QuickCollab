export const dateFormatter = (date: string) => {
  return date?.substring(0, 10);
};

export const formatDate = (
  isoString: string,
  timeZone: string = "Asia/Kolkata"
) => {
  const date = new Date(isoString); // Convert ISO string to Date object

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium", // Example: "13 Mar 2025"
    timeStyle: "short", // Example: "3:30 PM"
    timeZone, // Convert to the provided time zone
  }).format(date);
};

export const getYearAndMonth = (date: Date | string) => {
  let tempDate = date;
  if (!(tempDate instanceof Date)) {
    tempDate = new Date(date);
  }
  console.log(tempDate.getFullYear(), tempDate.getMonth());
  const year = tempDate.getFullYear();
  const month = tempDate.getMonth();

  return `${month < 10 ? "0" + month : month}/${year}`;
};
