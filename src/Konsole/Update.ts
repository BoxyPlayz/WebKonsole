import Konsole from "../Konsole.js";

export default function Update(this: Konsole) {
    Object.assign(this.container.style, {
            backgroundColor: this.options.backgroundColor,
            color: this.options.textColor,
            fontFamily: this.options.font,
            width: this.options.width,
            height: this.options.height,
            whiteSpace: "pre-wrap",
        });

        const output = this.buffer.join("\n");
        const cursor = this.cursorVisible ? "|" : " ";
        this.container.innerText = output + cursor;
}