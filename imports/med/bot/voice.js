/**
 * Created by kriz on 03/05/16.
 */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import fs from 'fs';
import request from 'request';
import { spawn } from 'child_process';
import Promise from 'promise';
import xml2js from 'xml2js';

const asrSettings = Meteor.settings.yandexAsr;
const tempDir = Meteor.settings.tempDir;

function convertToWav(input) {
  const outFile = `${tempDir}/${Random.id()}.wav`;
  const avconv = spawn(
    'avconv',
    ['-y -i - -acodec pcm_s16le -ac 1 -ar 16000'.split(' '), outFile],
  );

  return new Promise((resolve, reject) => {
    let error = '';

    avconv.on('close', code => {
      if (code !== 0) {
        reject({ code, error });
      } else {
        const stats = fs.statSync(outFile);
        const size = stats.size;
        const input = fs.createReadStream(outFile);
        resolve({ input, size });
      }
    });
    avconv.stderr.on('data', data => error += data.toString());
    input.pipe(avconv.stdin);
  });
}

function sendToYandex({ input, size }) {
  var url = 'https://asr.yandex.net/asr_xml';

  var params = Object.assign({}, asrSettings, {
    uuid: Random._randomString(32, '0123456789abcdef'),
    topic: 'notes',
    lang: 'ru-RU',
  });

  return new Promise((resolve, reject) => {
    const post = request.post(url, {
      qs: params,
//        content: res.content,
      headers: {
//            'Content-Length': size,
        'Content-Type': 'audio/x-pcm;bit=16;rate=16000',
      },
    }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        xml2js.parseString(response.body, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      }
    });

    input.pipe(post);
  });


}

export function processVoice(bot, chatId, telegramId, message) {
  const voice = message.voice;
  const { file_id } = voice;

  speechToText(file_id).then(text => {

  });
  // get file

}

export function speechToText(bot, file_id) {
  return bot.downloadFile({ file_id })
    .then(convertToWav)
    .then(sendToYandex)
    .then(json => {
      // return most variant result
      return json.recognitionResults.variant[0]._;
    })
    .catch(err => console.error('getFile failed', err));
};
