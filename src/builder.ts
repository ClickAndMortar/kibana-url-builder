import * as rison from 'rison'
import * as types from './types'

const defaultPeriod: types.KibanaQueryPeriod = {
  from: 'now-15m',
  mode: 'quick',
  to: 'now'
}

export function buildDiscoverUrl ({ host, refreshInterval, period, columns, filters = [], index, interval, query, sort }: types.KibanaDiscoverUrlBuildParameters): string {
  if (!columns || columns.length === 0) {
    columns = ['_source']
  }

  const queryFilters = []

  filters.forEach((filter) => {
    if (!index) {
      throw new Error('index pattern is required for filters')
    }

    const queryFilter: any = {}
    queryFilter.$state = { store: 'appState' }
    queryFilter.meta = {
      alias: filter.alias ?? null,
      disabled: filter.disabled ?? false,
      index: index ?? 'missing-index-pattern',
      key: filter.field,
      negate: filter.negate ?? false,
      type: filter.type
    }

    if (filter.type === 'exists') {
      queryFilter.exists = {
        field: filter.field
      }
      queryFilter.meta.value = 'exists'
    } else if (filter.type === 'query') {
      const params = {
        query: filter.value,
        type: 'phrase'
      }

      queryFilter.query = {
        match: {
          [filter.field]: params
        }
      }

      queryFilter.meta.params = params
      queryFilter.meta.value = filter.value
    } else if (filter.type === 'phrases') {
      if (!Array.isArray(filter.value)) {
        throw new Error('Filter value must be an array when using phrases filter')
      }

      queryFilter.meta.params = filter.value
      queryFilter.meta.value = filter.value.join(', ')

      queryFilter.query = {
        bool: {
          minimum_should_match: 1,
          should: []
        }
      }

      filter.value.forEach((value) => {
        queryFilter.query.bool.should.push({
          match_phrase: {
            [filter.field]: value
          }
        })
      })
    } else if (filter.type === 'range') {
      if (!Array.isArray(filter.value) || filter.value.length !== 2) {
        throw new Error('Filter value must be an array of 2 values when using range filter')
      }

      const params = {
        gte: parseInt(filter.value[0]),
        lte: parseInt(filter.value[1])
      }

      queryFilter.meta.params = params
      queryFilter.meta.value = encodeURIComponent(`${params.gte} to ${params.lte}`)

      queryFilter.range = {
        [filter.field]: params
      }
    } else {
      throw new Error(`Unknown filter type [${filter.type}]`)
    }

    queryFilters.push(queryFilter)
  })

  interval = interval ?? 'auto'

  sort = sort ?? {
    field: '@timestamp',
    direction: 'desc'
  }

  const _g: any = {
    time: Object.assign({}, defaultPeriod, period)
  }

  if (refreshInterval) {
    _g.refreshInterval = refreshInterval
  }

  const _a: any = { columns, interval, filters: queryFilters, sort: [sort.field, sort.direction] }

  if (index) {
    _a.index = index
  }

  _a.query = {
    language: 'lucene',
    query: query ?? ''
  }

  return `${host.replace(/\/$/, '')}/app/kibana#/discover?_g=${rison.encode(_g)}&_a=${rison.encode(_a)}`
}
