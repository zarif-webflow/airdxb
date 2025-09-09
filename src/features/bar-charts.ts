import { barChart } from "@/charts/bar-chart";
import { type BarChartData } from "@/types/bar-chart";
import { assertValue } from "@/utils/util";

const getCmsBarValues = ({ type }: { type: "value" | "volume" }) => {
  const selector = type === "value" ? "[data-value-bar-parent]" : "[data-volume-bar-parent]";

  const barParent = assertValue(
    document.querySelector<HTMLElement>(selector),
    `${selector} was not found!`
  );
  const cmsItems = Array.from(barParent.querySelectorAll<HTMLElement>("[data-cms-item]"));

  if (cmsItems.length === 0) {
    throw new Error(`${selector} [data-cms-item] were not found!`);
  }

  const data: BarChartData = [];

  for (const cmsItem of cmsItems) {
    const label = cmsItem.querySelector<HTMLElement>("[data-label]")?.textContent;
    const valueStr = cmsItem.querySelector<HTMLElement>("[data-value]")?.textContent;
    const unit = cmsItem.querySelector<HTMLElement>("[data-unit]")?.textContent || undefined;

    if (!label || !valueStr) continue;

    const value = Number.parseFloat(valueStr);

    if (Number.isNaN(value)) continue;

    data.push({ label, value, unit });
  }

  barParent.remove();

  return data;
};

const initBarCharts = () => {
  const valueBarData = getCmsBarValues({ type: "value" });
  const volumeBarData = getCmsBarValues({ type: "volume" });

  const valueBarUnit = valueBarData[0]?.unit;
  // const volumeBarUnit = volumeBarData[0]?.unit;

  const volumeBarElement = assertValue(
    document.querySelector<HTMLCanvasElement>("[data-volume-barchart]"),
    "Canvas element([data-volume-barchart]) was not found!"
  );
  const valueBarElement = assertValue(
    document.querySelector<HTMLCanvasElement>("[data-value-barchart]"),
    "Canvas element([data-value-barchart]) was not found!"
  );

  const barTabVolumeTrigger = document.querySelector<HTMLElement>('[data-bar-trigger="volume"]');
  const barTabValueTrigger = document.querySelector<HTMLElement>('[data-bar-trigger="value"]');

  if (!barTabVolumeTrigger) {
    console.error(`[data-bar-trigger="volume"] wasn't found!`);
  }

  if (!barTabValueTrigger) {
    console.error(`[data-bar-trigger="value"] wasn't found!`);
  }

  barChart({
    canvasElement: volumeBarElement,
    data: volumeBarData,
    xTickCallback: (ctx) => {
      if (ctx === 0) return "0.0";
      if (typeof ctx === "number") {
        return `${(ctx / 1000).toFixed(1)}K`;
      }
      return ctx.toString();
    },
    // tooltipLabelCallback: (data) => {
    //   if (data.raw === 0) return '0.0';
    //   if (typeof data.raw === 'number') {
    //     return `${(data.raw / 1000).toFixed(1)}K`;
    //   }
    //   return data.toString();
    // },
    onChartInit: (chart) => {
      barTabVolumeTrigger?.addEventListener("click", () => {
        if (barTabVolumeTrigger.classList.contains("w--current")) return;

        chart.reset();
        chart.update();
      });
    },
  });

  barChart({
    canvasElement: valueBarElement,
    data: valueBarData,
    xTickCallback: (ctx) => {
      if (ctx === 0) return "0.0";
      if (typeof ctx === "number") {
        return `${ctx.toLocaleString()}${valueBarUnit}`;
      }
      return ctx.toString();
    },
    tooltipLabelCallback: (data) => {
      if (data.raw === 0) return "0.0";
      if (typeof data.raw === "number") {
        return `${data.raw.toLocaleString()}${valueBarUnit}`;
      }
      return data.toString();
    },
    onChartInit: (chart) => {
      barTabValueTrigger?.addEventListener("click", () => {
        if (barTabValueTrigger.classList.contains("w--current")) return;

        chart.reset();
        chart.update();
      });
    },
  });
};

initBarCharts();
