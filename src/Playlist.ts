import { PlaylistItem, PlaylistItemType } from "./PlaylistItem";
import { PlaylistPointer } from "./PlaylistPointer";
import { Store } from "./stores/Store";

export class Playlist {
	private defaultDuration: number;
	private items: PlaylistItem[];

	private name: string;
	private uuid: string;
	private store: Store;

	constructor(name: string, uuid: string, items: PlaylistItem[], store: Store) {
		this.defaultDuration = 5;
		this.name = name;
		this.uuid = uuid;
		this.items = items;
		this.store = store;
	}

	public save(): Promise<void> {
		return this.store.savePlaylist({
			name: this.name,
			uuid: this.uuid,
			items: this.items.map(i => ({
				name: i.getName(),
				type: i.getType(),
				settings: i.getSettings(),
			})),
		});
	}

	getName(): string {
		return this.name;
	}

	getUuid(): string {
		return this.uuid;
	}

	setName(name: string): Promise<void> {
		this.name = name;
		return this.save();
	}

	getItems(): PlaylistItem[] {
		return [...this.items];
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}

	renameItem(index: number, name: string): Promise<void> {
		if (index >= this.items.length) {
			throw "out of bounds";
		}

		this.items[index].setName(name);
		return this.save();
	}

	deleteItem(index: number): Promise<void> {
		if (index >= this.items.length) {
			throw "out of bounds";
		}

		this.items.splice(index, 1);
		return this.save();
	}

	moveItem(index: number, toIndex: number): Promise<void> {
		if (index >= this.items.length || toIndex > this.items.length) {
			throw "out of bounds";
		}

		// Better way?
		const [ item ] = this.items.splice(index, 1);
		if (index < toIndex) toIndex--;

		this.items.splice(toIndex, 0, item);
		return this.save();
	}

	addItem(item: PlaylistItem): Promise<void> {
		this.items.push(item);
		return this.save();
	}

	modifyItem(index: number, type: PlaylistItemType, settings: any): Promise<void> {
		if (index >= this.items.length) {
			throw "out of bounds";
		}

		const item = this.items[index];
		if (item.getType() !== type) {
			throw "playlist item type mismatch";
		}

		item.setSettings(settings);
		return this.save();
	}

	play(): PlaylistPointer {
		return new PlaylistPointer(this, this.items);
	}

	getDefaultDuration(): number {
		return this.defaultDuration;
	}
}
