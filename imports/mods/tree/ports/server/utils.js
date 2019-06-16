
export const toPromise = obs =>
  new Promise((resolve, reject) => {
    obs.subscribe({
      next: resolve,
      error: reject,
    });
  });
