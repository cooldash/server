import { withProps } from 'recompose';
import FileSaver from 'file-saver';
import meteorCall from '../../utils/meteor-async-call';

const base64ToByteArray = base64 => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Uint8Array(byteNumbers);
};

export const withGetExcel = (publish, fileName) => withProps(props => ({
  downloadExcel(...args) {
    let pub = publish, n = fileName;
    if (typeof publish === 'function') {
      ({ publish: pub, name: n } = publish(props));
    }

    if (!pub) throw new Error('publication name not specified for withGetExcel');

    meteorCall('excel.generate', pub, ...args)
      .then(({ base64 }) => {
        const byteArray = base64ToByteArray(base64);
        const blob = new Blob([byteArray], { type: 'octet/stream' });
        FileSaver.saveAs(blob, n || 'data.xslx');
      })
      .catch(err => {
        console.error('cant download excel', err);
      });
  },
}));
