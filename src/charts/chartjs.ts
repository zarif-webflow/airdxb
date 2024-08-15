import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  elements,
} from 'chart.js';
import { controllers } from 'chart.js';

Chart.register(
  Tooltip,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  controllers.BarController,
  elements.BarElement
);

export { Chart };
