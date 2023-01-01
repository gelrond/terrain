export interface IModifier<_TSource,_TTarget> {
    modify(source: _TSource): _TTarget;
}
