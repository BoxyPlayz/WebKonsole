import baseCommands, { registerBuiltins } from './BaseCommands.js';
import Command from './Command.js';
import Register from './Konsole/Register.js';
import replaceVars from './Konsole/ReplaceVars.js';
import RunCommand from './Konsole/RunCommand.js';
import Update from './Konsole/Update.js';

interface Options {
	width?: string;
	height?: string;
	textColor?: string;
	backgroundColor?: string;
	font?: string;
	initCommand?: string;
	prefix: string;
	variables: { [key: string]: string };
}

let ascii = `Loading ASCII art...`;
async function loadASCII() {
	try {
		const response = await fetch('ASCII.txt');
		if (!response.ok) {
			ascii = `Error: ${response.status} ${response.statusText}`;
		}
		ascii = await response.text();
	} catch (error: any) {
		ascii = `Error fetching ASCII art: ${error.message}`;
	}
}

export default class Konsole {
	public container: HTMLElement;
	public options: Options;
	public buffer: string[] = [];
	public cursorVisible: boolean;
	public blinkTime: number;
	public history: string[];
	public history_index: number;
	public commands: Command[];
	public version: string = '1.2.0';
	public branch: string = 'stable';
	public works = true;

	public update: () => void;
	public replaceVars: (text: string) => Promise<string>;
	public runCommand: (text: string) => Promise<void>;
	public register: (command: Command) => Promise<void>;

	constructor(Container: HTMLElement, options = { prefix: '$ ' }) {
		this.replaceVars = replaceVars.bind(this);
		this.update = Update.bind(this);
		this.runCommand = RunCommand.bind(this);
		this.register = Register.bind(this);
		this.container = Container as HTMLElement;
		this.options = Object.assign(
			{
				width: '100%',
				height: '100%',
				textColor: 'lime',
				backgroundColor: 'black',
				font: 'monospace',
				initCommand: 'echo {version_ascii}\nv{version}-{branch}',
				prefix: options.prefix || '$ ',
				variables: {
					version: '1.2.0',
					version_ascii: ascii,
					ascii_gen: 'https://patorjk.com/software/taag/#p=display&f=Alligator2&t=Konsole',
					branch: 'stable',
				},
			},
			options
		);
		loadASCII().then(() => {
			this.update();
		});

		console.log(ascii);

		this.buffer = [];
		this.cursorVisible = true;
		this.blinkTime = 0;
		this.history = [];
		this.history_index = 0;

		this.commands = baseCommands;
        registerBuiltins((cmd) => this.commands.push(cmd))

		setInterval(() => {
			if (this.blinkTime >= 500) {
				this.cursorVisible = !this.cursorVisible;
				this.update();
				this.blinkTime = 0;
			}
			this.blinkTime += 100;
		}, 100);

		window.addEventListener('keydown', async (event) => {
			event.preventDefault();
			this.blinkTime = 0;
			this.cursorVisible = true;

			if (this.works === false) {
				return;
			}

			if (this.buffer.length === 0) {
				this.buffer.push(this.options.prefix || '');
			}

			const currentIndex = this.buffer.length - 1;
			const currentLine = this.buffer[currentIndex] || '';

			if (event.key === 'Enter') {
				const inputText = currentLine.slice(this.options.prefix.length);
				if (this.history[0] != inputText && inputText.trim()) {
					this.history.unshift(inputText);
					if (this.history_index != 0) this.history_index++;
				}
				await this.runCommand(inputText);
				this.container.scrollTop = this.container.scrollHeight;
			} else if (event.key === 'Backspace') {
				if (event.shiftKey) {
					this.buffer[currentIndex] = this.options.prefix;
				} else if (currentLine.length > this.options.prefix.length) {
					this.buffer[currentIndex] = currentLine.slice(0, -1);
				}
				this.container.scrollTop = this.container.scrollHeight;
			} else if (event.ctrlKey && event.key === 'l') {
				this.buffer = [this.options.prefix];
			} else if (event.key.length === 1 && !event.ctrlKey && !event.altKey) {
				this.buffer[currentIndex] += event.key;
				this.container.scrollTop = this.container.scrollHeight;
			} else if (event.key == 'ArrowUp') {
				if (
					this.history.includes(
						(this.buffer[currentIndex] || '').slice(
							this.options.prefix.length,
							(this.buffer[currentIndex] || '').length
						)
					) ||
					this.history_index == 0
				)
					this.history_index++;
				if (this.history_index > this.history.length)
					this.history_index = this.history.length;
				if (this.history_index == 0) return;
				this.buffer[currentIndex] =
					this.options.prefix + this.history[this.history_index - 1];
				this.container.scrollTop = this.container.scrollHeight;
			} else if (event.key == 'ArrowDown') {
				if (
					this.history.includes(
						(this.buffer[currentIndex] || '').slice(
							this.options.prefix.length,
							(this.buffer[currentIndex] || '').length
						)
					) ||
					this.history_index == 0
				)
					this.history_index -= 1;
				if (this.history_index < 0) this.history_index = 0;
				if (this.history_index == 0) {
					this.buffer[currentIndex] = this.options.prefix;
					this.update();
					return;
				}
				this.buffer[currentIndex] =
					this.options.prefix + this.history[this.history_index - 1];
				this.container.scrollTop = this.container.scrollHeight;
			} else if (event.key == 'v' && event.ctrlKey) {
				this.buffer[currentIndex] += await navigator.clipboard.readText();
				this.container.scrollTop = this.container.scrollHeight;
			}

			this.update();
		});

		this.runCommand(this.options.initCommand || '');
	}
}
