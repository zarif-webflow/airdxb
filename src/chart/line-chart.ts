import {
  CategoryScale,
  Chart,
  type ChartConfiguration,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';

import { LINE_CHART_DEFAULT_COLOR } from '@/utils/constants';
import { data } from '@/utils/static-data';
import { assertValue } from '@/utils/util';

Chart.register(Tooltip, LineController, LineElement, PointElement, CategoryScale, LinearScale);

const initChart = () => {
  const canvasElement = assertValue(
    document.querySelector<HTMLCanvasElement>('#myChart'),
    'Canvas element(#myChart) was not found!'
  );

  const computedStyles = window.getComputedStyle(canvasElement);

  const { fontFamily, fontWeight, fontSize } = computedStyles;

  const colorPrimary =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-primary') ??
    LINE_CHART_DEFAULT_COLOR;
  const colorBorder =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-border') ??
    LINE_CHART_DEFAULT_COLOR;
  const colorBorderMiddle =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-border-middle') ??
    LINE_CHART_DEFAULT_COLOR;

  const stepSize = 2;
  const values = data.map((item) => item.value);
  const months = data.map((item) => item.month);

  const maxValue = values.reduce((acc, curr) => (curr > acc ? curr : acc), 0);
  const numberOfLines = Math.ceil(maxValue / stepSize) + 1;

  const config: ChartConfiguration<'line', number[], string> = {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          data: values,
          borderWidth: 3,
          borderColor: colorPrimary,
          pointStyle: 'circle',
        },
      ],
    },

    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          border: { display: true, color: colorBorder, width: 2 },
          grid: {
            display: true,
            lineWidth: 0,
            drawTicks: true,
            tickWidth: 2,
            tickColor: colorBorder,
            tickLength: 10,
          },
          offset: true,
          ticks: { color: colorPrimary },
        },
        y: {
          beginAtZero: true,
          grid: {
            lineWidth: (ctx) => {
              if (ctx.index === Math.floor(numberOfLines / 2)) return 2;
              return 1;
            },
            color: (ctx) => {
              if (ctx.index === Math.floor(numberOfLines / 2)) return colorBorderMiddle;
              return colorBorder;
            },
            drawTicks: false,
          },
          border: { display: true, color: colorBorder, width: 2 },
          ticks: {
            stepSize,
            color: colorPrimary,
            padding: 10,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
    },
  };

  Chart.defaults.font.family = fontFamily;
  Chart.defaults.font.weight = Number.parseInt(fontWeight);
  Chart.defaults.font.size = Number.parseFloat(fontSize);

  let graph = new Chart(canvasElement, config);

  document.fonts.ready.then(() => {
    graph.destroy();
    graph = new Chart(canvasElement, config);
  });
};

initChart();
