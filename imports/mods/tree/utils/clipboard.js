
class Clipboard {
  clipData = null;

  setData = (data) => {
    if (!data) {
      return;
    }

    this.clipData = data;
  };

  getData = () => {
    return this.clipData;
  };

  hasData = () => {
    return this.clipData !== null;
  };

  isDataInstanceOf(className) {
    return this.clipData instanceof className;
  }
}

const clipboard = new Clipboard();

export default clipboard;