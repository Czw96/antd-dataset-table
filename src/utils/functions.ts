// 数据更新
export function dataUpdate<T extends Record<keyof T, unknown>>(
  key: keyof T,
  UpdateItem: T,
  dataItems: readonly T[],
  insertPosition: number = 0 // 插入位置，默认在数组开头
) {
  const items = [...dataItems];
  const index = items.findIndex((_item) => _item[key] === UpdateItem[key]);

  if (index === -1) {
    items.splice(insertPosition, 0, UpdateItem);
  } else {
    items.splice(index, 1, UpdateItem);
  }

  return items;
}

// 数据删除
export function dataRemove<T extends Record<keyof T, unknown>>(key: keyof T, RemoveItem: T, dataItems: readonly T[]) {
  return dataItems.filter((dataItem) => dataItem[key] !== RemoveItem[key]);
}
