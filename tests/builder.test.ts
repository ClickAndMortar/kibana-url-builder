import { buildDiscoverUrl } from '../src'

describe('buildDiscoverUrl', function () {
  it('default', function () {
    const url = buildDiscoverUrl({
      host: 'http://kibana',
      filters: []
    })

    expect(url).toBe("http://kibana/app/kibana#/discover?_g=(time:(from:now-15m,mode:quick,to:now))&_a=(columns:!(_source),filters:!(),interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))")
  })

  it('should add a default value for filters when none is not provided', function () {
    const url = buildDiscoverUrl({
      host: 'http://kibana',
    })

    expect(url).toBe(
      "http://kibana/app/kibana#/discover?_g=(time:(from:now-15m,mode:quick,to:now))&_a=(columns:!(_source),filters:!(),interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))"
    );
  })
})
