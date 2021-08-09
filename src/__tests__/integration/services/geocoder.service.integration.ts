
import {expect} from '@loopback/testlab';
import {GeocoderDataSource} from '../../../datasources/geocoder.datasource';
import {GeocoderService, GeocoderServiceProvider} from '../../../services/geocoder.service';
import {
  getProxiedGeoCoderConfig, givenCachingProxy, HttpCachingProxy
} from '../../helpers';

describe('GeoLookupService', function () {
  // tslint:disable-next-line:no-invalid-this
  this.timeout(30 * 1000);

  let cachingProxy: HttpCachingProxy;
  before(async () => (cachingProxy = await givenCachingProxy()));
  after(() => cachingProxy.stop());

  let service: GeocoderService;
  before(givenGeoService);

  it('resolves an address to a geo point', async () => {
    const points = await service.geocode('1 New Orchard Road, Armonk, 10504');

    expect(points).to.deepEqual([
      {
        y: 41.109653,
        x: -73.72467,
      },
    ]);
  });

  async function givenGeoService() {
    const config = getProxiedGeoCoderConfig(cachingProxy);
    const dataSource = new GeocoderDataSource(config);
    service = await new GeocoderServiceProvider(dataSource).value();
  }
});
