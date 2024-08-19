import { barChart } from '@/charts/bar-chart';
import { BarChartData } from '@/types/bar-chart';
import { assertValue } from '@/utils/util';

const volumeBarData: BarChartData = [
  { label: 'Jumeirah Village Circle', value: 1594 },
  { label: 'Zaabeel First', value: 1054 },
  { label: 'Business Bay', value: 796 },
  { label: 'Dubai Marina', value: 546 },
  { label: 'Dubai Hills Estates', value: 437 },
];

const valueBarData: BarChartData = [
  {
    label: 'Zabeel First',
    value: 3250,
  },
  {
    label: 'Dubai Marina',
    value: 1718,
  },
  {
    label: 'Business Bay',
    value: 1445,
  },
  {
    label: 'Jumeirah Village Circle',
    value: 1416,
  },
  {
    label: 'Palm Deira',
    value: 1339,
  },
];

const initBarCharts = () => {
  const volumeBarElement = assertValue(
    document.querySelector<HTMLCanvasElement>('[data-volume-barchart]'),
    'Canvas element([data-volume-barchart]) was not found!'
  );
  const valueBarElement = assertValue(
    document.querySelector<HTMLCanvasElement>('[data-value-barchart]'),
    'Canvas element([data-value-barchart]) was not found!'
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
      if (ctx === 0) return '0.0';
      if (typeof ctx === 'number') {
        return `${(ctx / 1000).toFixed(1)}K`;
      }
      return ctx.toString();
    },
    tooltipLabelCallback: (data) => {
      if (data.raw === 0) return '0.0';
      if (typeof data.raw === 'number') {
        return `${(data.raw / 1000).toFixed(1)}K`;
      }
      return data.toString();
    },
    onChartInit: (chart) => {
      barTabVolumeTrigger?.addEventListener('click', () => {
        if (barTabVolumeTrigger.classList.contains('w--current')) return;

        chart.reset();
        chart.update();
      });
    },
  });

  barChart({
    canvasElement: valueBarElement,
    data: valueBarData,
    xTickCallback: (ctx) => {
      if (ctx === 0) return '0.0';
      if (typeof ctx === 'number') {
        return `${ctx.toLocaleString()}M`;
      }
      return ctx.toString();
    },
    tooltipLabelCallback: (data) => {
      if (data.raw === 0) return '0.0';
      if (typeof data.raw === 'number') {
        return `${data.raw.toLocaleString()}M`;
      }
      return data.toString();
    },
    onChartInit: (chart) => {
      barTabValueTrigger?.addEventListener('click', () => {
        if (barTabValueTrigger.classList.contains('w--current')) return;

        chart.reset();
        chart.update();
      });
    },
  });
};

initBarCharts();
