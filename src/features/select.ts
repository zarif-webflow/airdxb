import { setupSelectron } from "@/packages/selectron";
import { getAssertedHtmlElement } from "@/utils/util";

setupSelectron(getAssertedHtmlElement("[data-st-root]"));
