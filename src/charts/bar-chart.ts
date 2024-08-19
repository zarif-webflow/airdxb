import { Chart } from '@/charts/chartjs';
import { BarChartData } from '@/types/bar-chart';
import { assertValue, parseFloatFallback } from '@/utils/util';
import { ChartConfiguration, Scale, TooltipItem } from 'chart.js';

const BAR_CHART_DEFAULT_COLOR = '#000000';

export const barChart = ({
  canvasElement,
  data,
  xTickCallback,
  yTickCallback,
  tooltipLabelCallback,
  onChartInit,
}: {
  canvasElement: HTMLCanvasElement;
  data: BarChartData;
  xTickCallback?: (this: Scale, ctx: string | number) => string;
  yTickCallback?: (this: Scale, ctx: string | number) => string;
  tooltipLabelCallback?: (data: TooltipItem<'bar'>) => string;
  onChartInit?: (chart: Chart<'bar', (number | [number, number] | null)[], unknown>) => void;
}) => {
  const computedStyles = window.getComputedStyle(canvasElement);

  const { fontFamily, fontWeight, fontSize } = computedStyles;

  const barFillColor =
    window.getComputedStyle(document.documentElement).getPropertyValue('--bar-fill') ||
    BAR_CHART_DEFAULT_COLOR;
  const barGridColor =
    window.getComputedStyle(document.documentElement).getPropertyValue('--bar-grid') ||
    BAR_CHART_DEFAULT_COLOR;
  const barBorderColor =
    window.getComputedStyle(document.documentElement).getPropertyValue('--bar-border') ||
    BAR_CHART_DEFAULT_COLOR;
  const barRadiusCssVar = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--bar-radius');

  const barRadius =
    barRadiusCssVar !== '' ? Number.parseFloat(barRadiusCssVar.replace('px', '')) : 16;

  const barParent = assertValue(
    canvasElement.closest<HTMLElement>('[data-bar-parent]'),
    'Canvas parent element([data-bar-parent]) was not found!'
  );
  const animationDuration = parseFloatFallback(barParent?.dataset.animationDuration, 1) * 1000;
  const animationDelay = parseFloatFallback(barParent?.dataset.animationDelay, 0) * 1000;
  const viewportThreshold = parseFloatFallback(barParent?.dataset.viewportThreshold, 0.8);
  const viewportMargin = parseFloatFallback(barParent?.dataset.viewportMargin, 0);

  const config: ChartConfiguration<'bar', (number | [number, number] | null)[], unknown> = {
    data: {
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: barFillColor,
          borderRadius: barRadius,
        },
      ],
      labels: data.map((item) => item.label),
    },
    type: 'bar',
    options: {
      //   borderColor: 'transparent',
      indexAxis: 'y',
      responsive: true,
      animation: {
        duration: animationDuration,
      },
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            ...(tooltipLabelCallback && { label: tooltipLabelCallback }),
          },
          padding: 9,
          titleMarginBottom: 8,
          titleAlign: 'left',
          footerMarginTop: 0,
          displayColors: false,
        },
      },
      scales: {
        x: {
          ticks: {
            ...(xTickCallback && { callback: xTickCallback }),
          },
          grid: { color: barGridColor, tickWidth: 0 },
          border: { width: 0, display: false },
        },
        y: {
          ticks: {
            ...(yTickCallback && { callback: yTickCallback }),
          },
          grid: {
            tickWidth: 0,
          },
          border: { color: barBorderColor },
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

          document.fonts.ready.then(() => {
            const barChart = new Chart(canvasElement, config);
            onChartInit?.(barChart);
          });
        }, animationDelay);

        interSectionObserver.unobserve(barParent);
      }
    },
    {
      root: null,
      threshold: viewportThreshold,
      rootMargin: `${viewportMargin}px`,
    }
  );

  interSectionObserver.observe(barParent);
};
