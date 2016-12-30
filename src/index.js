import 'babel-polyfill';
import 'isomorphic-fetch';

import * as d3 from 'd3-selection';
import xs from 'xstream';
import jsmediatags from 'jsmediatags';

// Web audio API context
const context = new AudioContext();
const filename = 'data/testpodcastfigtech-v2.mp3';

const blob$ = xs
  .fromPromise(fetch(filename).then(res => res.blob()))
  .remember();

const audioBuffer$ = xs
  .fromPromise(
    fetch(filename)
      .then(res => res.arrayBuffer())
      .then(buffer => context.decodeAudioData(buffer))
  )
  .remember();

const source$ = audioBuffer$
  .map(audioBuffer => {
    // load the file as an audioBuffer
    // https://www.html5rocks.com/en/tutorials/webaudio/intro/
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    return source;
  })
  .remember();

const tag$ = blob$
  .map(blob => xs.fromPromise(new Promise(res => jsmediatags.read(blob, { onSuccess: res }))))
  .flatten()
  .remember();

tag$.addListener({
  next: tag => {

    console.log(tag);

    // https://github.com/43081j/id3/issues/12
    // https://github.com/43081j/id3/pull/21
    const arrayBufferView = new Uint8Array(tag.tags.picture.data);
    const blob = new Blob([arrayBufferView], { type: tag.tags.picture.format });
    const imageURL = URL.createObjectURL(blob);
    d3.select('body').append('img').attr('src', imageURL);
  }
});

source$.addListener({
  next: source => source.start(0)
});
