import { PendingRegistration } from "./PendingRegistration";

export class RegistrationManager {
	private pending: PendingRegistration[];

	constructor() {
		this.pending = [];
	}

	public getPending(): PendingRegistration[] {
		return this.pending;
	}
}