

import {HttpCachingProxy} from '@loopback/http-caching-proxy';
import {merge} from 'lodash';
import * as path from 'path';
import {GeoPoint} from '..//services/geocoder.service';
import * as GEO_CODER_CONFIG from '../datasources/geocoder.datasource.json';
import {Taskprogress} from '../models/taskprogress.model';


export function givenTaskprogress(Taskprogress?: Partial<Taskprogress>) {
  const data = Object.assign(
    {
      title: 'do a thing',
      desc: 'There are some things that need doing',
      isComplete: false,
    },
    Taskprogress,
  );
  return new (Taskprogress as any)(data);
}

export const aLocation = {
  address: '1 New Orchard Road, Armonk, 10504',
  geopoint: <GeoPoint>{y: 41.109653, x: -73.72467},
  get geostring() {
    // tslint:disable-next-line:no-invalid-this
    return `${this.geopoint.y},${this.geopoint.x}`;
  },
};

export function getProxiedGeoCoderConfig(proxy: HttpCachingProxy) {
  return merge({}, GEO_CODER_CONFIG, {
    options: {
      proxy: proxy.url,
      tunnel: false,
    },
  });
}

export {HttpCachingProxy};
export async function givenCachingProxy() {
  const proxy = new HttpCachingProxy({
    cachePath: path.resolve(__dirname, '.http-cache'),
  });
  await proxy.start();
  return proxy;
}
