export const MonthsArray = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

type Months = (typeof MonthsArray)[number];

export const data: { month: Months; value: number }[] = [
  {
    month: "Jan",
    value: 14,
  },
  {
    month: "Feb",
    value: 12,
  },
  {
    month: "Mar",
    value: 12,
  },
  {
    month: "Apr",
    value: 10,
  },
  {
    month: "May",
    value: 9,
  },
  {
    month: "Jun",
    value: 6.75,
  },
  {
    month: "Jul",
    value: 6.75,
  },
  {
    month: "Aug",
    value: 5.5,
  },
  {
    month: "Sep",
    value: 10,
  },
  {
    month: "Oct",
    value: 12,
  },
  {
    month: "Nov",
    value: 12,
  },
  {
    month: "Dec",
    value: 15,
  },
];
