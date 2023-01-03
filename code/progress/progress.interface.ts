export interface IProgress {
    begin(total: number, text: string | null, step: number): void;
    next(): void;
    render(percentage: number, text: string | null): void;
    reset(): void;
}
