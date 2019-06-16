
export function removeObserver(observers, observer, onEmpty) {
  const filtered = observers.filter(o => o !== observer);
  if (filtered.length === 0 && onEmpty) {
    onEmpty();
  }
  return filtered;
}