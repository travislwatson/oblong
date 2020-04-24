export interface OblongQuery<T> {
    (state: any): T;
    oblongType: 'query';
}
