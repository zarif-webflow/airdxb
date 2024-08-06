import {
  CategoryScale,
  Chart,
  type ChartConfiguration,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';

import { LINE_CHART_DEFAULT_COLOR } from '@/utils/constants';
import { data } from '@/utils/static-data';
import { assertValue, hexToRgb } from '@/utils/util';

Chart.register(
  Tooltip,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

const initChart = () => {
  const canvasElement = assertValue(
    document.querySelector<HTMLCanvasElement>('#myChart'),
    'Canvas element(#myChart) was not found!'
  );

  const computedStyles = window.getComputedStyle(canvasElement);

  const { fontFamily, fontWeight, fontSize } = computedStyles;

  const colorLine =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-line') ??
    LINE_CHART_DEFAULT_COLOR;
  const colorBorder =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-border') ??
    LINE_CHART_DEFAULT_COLOR;
  const colorBorderMiddle =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-border-middle') ??
    LINE_CHART_DEFAULT_COLOR;
  const colorText =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-text') ??
    LINE_CHART_DEFAULT_COLOR;
  const colorTextSecondary =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-text-secondary') ??
    LINE_CHART_DEFAULT_COLOR;

  const stepSize = 4;
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
          borderColor: colorLine,
          pointStyle: 'circle',
          fill: true,
          backgroundColor: (ctx) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
            const colorRgb = hexToRgb(colorLine);
            const startColor =
              colorRgb !== null
                ? `rgb(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0.2)`
                : `rgba(0, 0, 0, 0.1)`;
            const endColor =
              colorRgb !== null
                ? `rgb(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0)`
                : `rgba(0, 0, 0, 0)`;
            gradient.addColorStop(0, startColor);
            gradient.addColorStop(1, endColor);
            return gradient;
          },
          pointBackgroundColor: colorLine,
        },
      ],
    },

    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          border: { display: false },
          grid: {
            display: false,
          },
          offset: true,
          ticks: { color: colorText },
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
          ticks: {
            stepSize,
            padding: 10,
            color: colorTextSecondary,
          },
          border: {
            display: false,
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
