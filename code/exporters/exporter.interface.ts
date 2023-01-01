export interface IExporter<_TSource> {
    export(source: _TSource): void;
}
