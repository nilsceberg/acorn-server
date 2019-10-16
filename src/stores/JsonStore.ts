import { promises as fs } from "fs";
import { ScreenData, ScreenType } from "./Store";

export class JsonStore {
	private filename: string;
	private data: {
		screens: { [uuid: string]: {
			name: string,
			children: string[],
		} };
	} = {
		screens: {}
	};

	constructor(filename: string) {
		this.filename = filename;
	}

	public async load() {
		try {
			const file = await fs.open(this.filename, "r");
			this.data = JSON.parse(await file.readFile({
				encoding: "utf-8",
			}));
			await file.close();
		} catch (e) {
			console.warn(e);
			try {
				const file = await fs.open(this.filename, "w");
				await file.writeFile(JSON.stringify(this.data), {
					encoding: "utf-8"
				});
				await file.close();
			} catch (f) {
				console.error(e);
			}
		}
	}

	public async loadScreens(): Promise<ScreenData[]> {
		const array = [];
		for (const uuid in this.data.screens) {
			const data = this.data.screens[uuid];
			array.push({
				type: data.children ? ScreenType.Group : ScreenType.Screen,
				uuid: uuid,
				name: data.name,
				children: data.children,
			});
		}
		return array;
	}
}
