import Konsole from "../Konsole.js";

export default async function replaceVars( this: Konsole, text = "") {
        let prev;
        do {
            prev = text;
            for (const [key, value] of Object.entries(this.options.variables)) {
                text = text.replaceAll(`{${key}}`, value);
            }
        } while (text !== prev);

        text = text.replaceAll("\\n", "\n");
        return text;
    }