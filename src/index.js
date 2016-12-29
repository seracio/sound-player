import 'babel-polyfill';
import 'isomorphic-fetch';

import xs from 'xstream';
import jsmediatags from 'jsmediatags';

const audioEl = document.querySelector('#target');

audioEl.addEventListener('canplaythrough', e => {
  console.log(e);
});

audioEl.addEventListener('loadedmetadata', e => {
  console.log(e);
});



(async function main() {

  // load the file as an audioBuffer
  // https://www.html5rocks.com/en/tutorials/webaudio/intro/
  const context = new AudioContext();

  const myBlob = await fetch('data/test_podcast_figaro_1.mp3')
    .then(res => res.blob());

  const myAudioBuffer = await fetch('data/test_podcast_figaro_1.mp3')
    .then(res => res.arrayBuffer())
    .then(buff => context.decodeAudioData(buff));

  // play sound
  console.log(myAudioBuffer)
  const source = context.createBufferSource();
  source.buffer = myAudioBuffer;
  source.connect(context.destination);
  source.start(0);

  jsmediatags.read(myBlob, {
    onSuccess: function(tag) {
      console.log(tag);
    },
    onError: function(error) {
      console.log(error);
    }
  });

}());
