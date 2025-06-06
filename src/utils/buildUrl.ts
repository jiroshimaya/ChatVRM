/**
 * github pagesに公開時にアセットを読み込めるようにするため、
 * 環境変数を見てURLにリポジトリ名を追加する
 */
export function buildUrl(path: string): string {
  const root = process.env.BASE_PATH || '';
  return root + path;
}
