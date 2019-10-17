export class Condition {
	private resolvers: (() => void)[] = [];

	notifyAll() {
		const resolvers = this.resolvers;
		this.resolvers = [];
		resolvers.forEach(r => r());
	}

	wait(): Promise<void> {
		return new Promise(resolve => this.resolvers.push(resolve));
	}
}
