// import from an external lib

interface Tag {
  [key: string]: string
}

export interface Metric {
  add: (metric: string, tag?: Tag, count?: number) => void
}

const metric: Metric = {
  add: (metric: string, tag?: Tag, count?: number) => { console.log('Metric sent'); }
};

export default metric;
