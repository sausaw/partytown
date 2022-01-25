import { AudioTrackList, hasAudioTracks } from './audio-track';
import {
  definePrototypePropertyDescriptor,
  getter,
  InstanceIdKey,
  setter,
  WinIdKey,
} from './bridge';
import { CurrentTimeKey, PlaybackRateKey, ReadyStateKey, TimeRangesKey } from './utils';
import { TimeRanges } from './time-ranges';

const HTMLMediaDescriptorMap: PropertyDescriptorMap & ThisType<any> = {
  buffered: {
    get() {
      if (!this[TimeRangesKey]) {
        this[TimeRangesKey] = new TimeRanges(this[WinIdKey], this[InstanceIdKey], ['buffered']);

        setTimeout(() => {
          this[TimeRangesKey] = undefined;
        }, 5000);
      }
      return this[TimeRangesKey];
    },
  },

  currentTime: {
    get() {
      if (typeof this[CurrentTimeKey] !== 'number') {
        this[CurrentTimeKey] = getter(this, ['currentTime']);

        setTimeout(() => {
          this[CurrentTimeKey] = undefined;
        }, 1000);
      }
      return this[CurrentTimeKey];
    },
    set(rate) {
      setter(this, ['currentTime'], rate);
    },
  },

  playbackRate: {
    get() {
      if (typeof this[PlaybackRateKey] !== 'number') {
        this[PlaybackRateKey] = getter(this, ['playbackRate']);

        setTimeout(() => {
          this[PlaybackRateKey] = undefined;
        }, 1000);
      }
      return this[PlaybackRateKey];
    },
    set(rate) {
      setter(this, ['playbackRate'], rate);
    },
  },

  readyState: {
    get() {
      if (this[ReadyStateKey] === 4) {
        return 4;
      }
      if (typeof this[ReadyStateKey] !== 'number') {
        this[ReadyStateKey] = getter(this, ['readyState']);

        setTimeout(() => {
          this[ReadyStateKey] = undefined;
        }, 1000);
      }
      return this[ReadyStateKey];
    },
  },
};

if (hasAudioTracks) {
  HTMLMediaDescriptorMap.audioTracks = {
    get(this: any) {
      return new AudioTrackList(this);
    },
  };
}

definePrototypePropertyDescriptor(self.HTMLMediaElement, HTMLMediaDescriptorMap);
