export interface KibanaQueryRefreshInterval {
  pause: boolean;
  value: bigint; // In milliseconds
}

export interface KibanaQueryPeriod {
  from: string;
  to: string;
  mode: string;
}

export interface KibanaQueryFilter {
  type: string; // One of: exists, query
  field: string;
  value?: string|boolean|number; // Required for query
  negate: boolean;
  alias?: string;
}

export interface KibanaQuerySort {
  field: string;
  direction: string;
}

export interface KibanaDiscoverUrlBuildParameters {
  host: string;
  refreshInterval?: KibanaQueryRefreshInterval;
  period?: KibanaQueryPeriod;
  columns?: string[];
  filters: KibanaQueryFilter[];
  index?: string;
  interval?: string;
  query?: string;
  sort?: KibanaQuerySort;
}
