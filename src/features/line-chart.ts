import { type ChartConfiguration } from 'chart.js';
import { Chart } from '@/charts/chartjs';

import { LINE_CHART_DEFAULT_COLOR } from '@/utils/constants';
import { data } from '@/utils/static-data';
import { assertValue, hexToRgb, parseFloatFallback } from '@/utils/util';

const initChart = () => {
  const canvasElement = assertValue(
    document.querySelector<HTMLCanvasElement>('#line-chart'),
    'Canvas element(#line-chart) was not found!'
  );

  const computedStyles = window.getComputedStyle(canvasElement);

  const { fontFamily, fontWeight, fontSize } = computedStyles;

  const colorLine =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-line') ||
    LINE_CHART_DEFAULT_COLOR;
  const colorBorder =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-border') ||
    LINE_CHART_DEFAULT_COLOR;
  const colorBorderMiddle =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-border-middle') ||
    LINE_CHART_DEFAULT_COLOR;
  const colorText =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-text') ||
    LINE_CHART_DEFAULT_COLOR;
  const colorTextSecondary =
    window.getComputedStyle(document.documentElement).getPropertyValue('--chart-text-secondary') ||
    LINE_CHART_DEFAULT_COLOR;

  const chartParent = assertValue(
    canvasElement.closest<HTMLElement>('[data-chart-parent]'),
    'Canvas parent element([data-chart-parent]) was not found!'
  );
  const animationDuration = parseFloatFallback(chartParent?.dataset.animationDuration, 1) * 1000;
  const animationDelay = parseFloatFallback(chartParent?.dataset.animationDelay, 0) * 1000;
  const viewportThreshold = parseFloatFallback(chartParent?.dataset.viewportThreshold, 0.8);
  const viewportMargin = parseFloatFallback(chartParent?.dataset.viewportMargin, 0);

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
          pointRadius: 3,
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
      animation: {
        duration: animationDuration,
      },
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
            callback: (ctx) => {
              if (ctx.toString() === '0') return '0';
              return ctx.toString() + 'k';
            },
          },
          border: {
            display: false,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (data) => {
              const text = `${
                (Number.parseFloat(String(data.raw)) * 1000).toLocaleString() || 'N/A'
              }`;
              return text.length >= 10 ? text : text.padEnd(10);
            },
          },
          padding: 9,
          titleMarginBottom: 8,
          titleAlign: 'left',
          footerMarginTop: 0,
          displayColors: false,
        },
      },
    },
  };

  const interSectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) return;

        setTimeout(() => {
          Chart.defaults.font.family = fontFamily;
          Chart.defaults.font.size = Number.parseFloat(fontSize.replace('px', ''));
          Chart.defaults.font.weight = Number.parseFloat(fontWeight);

          let graph = new Chart(canvasElement, config);

          document.fonts.ready.then(() => {
            graph.destroy();
            graph = new Chart(canvasElement, config);
          });
        }, animationDelay);

        interSectionObserver.unobserve(chartParent);
      }
    },
    {
      root: null,
      threshold: viewportThreshold,
      rootMargin: `${viewportMargin}px`,
    }
  );

  interSectionObserver.observe(chartParent);
};

initChart();
