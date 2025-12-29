export function transformRecordToOption<T extends Record<string, string>>(
  record: T
) {
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
/**
 * 递归清洗数据中的字符串前后空格
 * @param data 需要清洗的数据
 */
export function trimParams<T>(data: T): T {
  if (typeof data === "string") {
    return data.trim() as unknown as T;
  }

  if (data === null || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => trimParams(item)) as unknown as T;
  }

  const newData: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      newData[key] = trimParams((data as any)[key]);
    }
  }

  return newData as T;
}
