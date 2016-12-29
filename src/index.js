import 'babel-polyfill';
import 'isomorphic-fetch';

import * as d3 from 'd3-selection';
import xs from 'xstream';
import jsmediatags from 'jsmediatags';

(async function main() {

  // load the file as an audioBuffer
  // https://www.html5rocks.com/en/tutorials/webaudio/intro/
  const context = new AudioContext();

  const filename = 'data/testpodcastfigtech-v2.mp3';

  let myBlob = await fetch(filename)
    .then(res => res.blob());

  const myAudioBuffer = await fetch(filename)
    .then(res => res.arrayBuffer())
    .then(buff => context.decodeAudioData(buff));

  // play sound
  console.log(myAudioBuffer);
  const source = context.createBufferSource();
  source.buffer = myAudioBuffer;
  source.connect(context.destination);
  //source.start(0);

  jsmediatags.read(myBlob, {
    onSuccess: function(tag) {
      console.log(tag);
      // https://github.com/43081j/id3/issues/12
      // https://github.com/43081j/id3/pull/21
      const arrayBufferView = new Uint8Array(tag.tags.picture.data);
      const blob = new Blob([arrayBufferView], {type: tag.tags.picture.format});
      const imageURL = URL.createObjectURL(blob);
      d3.select('body').append('img').attr('src', imageURL);
    },
    onError: function(error) {
      console.log(error);
    }
  });

}());
