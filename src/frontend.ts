import Jeff from "./Jeff.js";
import Konsole from "./Konsole.js";
const container = document.getElementById("konsole") as HTMLDivElement;
const konsole = new Konsole(container);
konsole.register(new Jeff);
konsole.update();