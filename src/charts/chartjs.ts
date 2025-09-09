import {
  CategoryScale,
  Chart,
  elements,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { controllers } from "chart.js";

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
