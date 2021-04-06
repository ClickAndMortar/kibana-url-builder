interface KibanaQueryRefreshInterval {
    pause: boolean;
    value: bigint; // in milliseconds
}

interface KibanaQueryPeriod {
    from: string;
    to: string;
    mode: string;
}

interface KibanaQueryQueryFilter {
    mode: string; // match
    field: string;
    query: string;
    type: string; // phrase
}

interface KibanaQueryExistsFilter {
    field: string;
}

interface KibanaQueryFilters {
    query: KibanaQueryQueryFilter[];
    exists: KibanaQueryExistsFilter[];
}

interface KibanaQueryQuery {
    language: string;
    query: string;
}

interface KibanaQuerySort {
    field: string;
    direction: string;
}

interface KibanaDiscoverUrlBuildParameters {
    host: string;
    refreshInterval?: KibanaQueryRefreshInterval;
    period?: KibanaQueryPeriod;
    columns: string[];
    filters: KibanaQueryFilters;
    index?: string;
    interval?: string;
    query?: string;
    sort?: KibanaQuerySort;
}

export function buildDiscoverUrl({host, refreshInterval, period, columns, filters, index, interval, query, sort}: KibanaDiscoverUrlBuildParameters): string {
    const _g: string[] = []

    if (refreshInterval) {
        _g.push(`refreshInterval:(pause:${refreshInterval.pause ? '!t' : '!f'},value:${refreshInterval.value})`)
    }

    if (!period) {
        period = {
            from: 'now-15m',
            to: 'now',
            mode: 'quick'
        }
    }

    _g.push(`time:(from:${period.from},mode:${period.mode},to:${period.to})`)

    const _a: string[] = []
    _a.push(`columns:!(${columns.join(',')})`)

    if (index) {
        _a.push(`index:'${index}'`)
    }

    if (!interval) {
        interval = 'auto'
    }

    _a.push(`interval:${interval}`)

    const queryFilters = []
    if (filters.query && filters.query.length > 0) {
        filters.query.forEach((filter) => {
            queryFilters.push(`${filter.mode}:(${filter.field}:(query:${filter.query},type:${filter.type}))`)
        })
    }

    const existsFilters = []
    if (filters.exists && filters.exists.length > 0) {
        filters.exists.forEach((filter) => {
            existsFilters.push(`field:${filter.field}`)
        })
    }

    // TODO: "meta" parameter is needed within filters to display active filters in toolbar ; however, this depends on index pattern being provided
    // TODO: repeat filter within filter for each filter (query, exists, etc.)
    _a.push(`filters:!(('$state':(store:appState),query:(${queryFilters.join(',')}),exists:(${existsFilters.join(',')})))`)

    const kibanaQuery: KibanaQueryQuery = {
        language: 'lucene',
        query: query ? query : ''
    }

    _a.push(`query:(language:${kibanaQuery.language},query:'${kibanaQuery.query.replace('\'', '\\\'')}')`)

    if (!sort) {
        sort = {
            field: '@timestamp',
            direction: 'desc'
        }
    }

    _a.push(`sort:!('${sort.field}',${sort.direction})`)

    return `${host.replace(/\/$/, '')}/app/kibana#/discover?_g=(${_g.join(',')})&_a=(${_a.join(',')})`
}
