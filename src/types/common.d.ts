declare namespace CommonType {
	interface StrategicPattern {
		/** If the condition is true, then call the action function */
		callback: () => boolean;
		/** The condition */
		condition: boolean;
	}
	type Option<K = string> = { label: string; value: K };

	type OptionWithReactNode<K = string> = { label: React.ReactNode; value: K };

	type YesOrNo = "N" | "Y";

	/** add null to all properties */
	type RecordNullable<T> = {
		[K in keyof T]?: T[K] | null;
	};
}
