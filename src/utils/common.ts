export function transformRecordToOption<T extends Record<string, string>>(record: T) {
	return Object.entries(record).map(([value, label]) => ({
		label,
		value,
	})) as CommonType.Option<keyof T>[];
}

export function toggleHtmlClass(className: string) {
	function add() {
		document.documentElement.classList.add(className);
	}

	function remove() {
		document.documentElement.classList.remove(className);
	}

	return {
		add,
		remove,
	};
}

export function translateOptions(options: CommonType.Option<string>[]) {
	return options.map((option) => ({
		...option,
		label: option.label,
	}));
}
