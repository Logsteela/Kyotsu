import { useMemo } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';
import { testDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';

type SourceItem = { label: string; count: number; example: string[] };
type SourceGroup = { kind: string; sources: SourceItem[] };
function extractSources(notes: string): {kind: string; source: string}[] {
  const found: {kind: string; source: string}[] = [];
  for (const match of notes.matchAll(/(問題|解答|音源)：([^　\n]+)/g)) {
    const source = match[2].trim().replace(/[、，。]+$/, '');
    if (source) found.push({ kind: match[1], source });
  }
  return found;
}
function SourceTable({ items }: { items: SourceItem[] }) {
  const { sorted, sortKey, direction, sortBy } = useSortedRows(items, 'count');
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead><tr className="border-b bg-gray-50">
          <SortHeader label="記載された出典名" column="label" {...{sortKey,direction}} onSort={sortBy} />
          <SortHeader label="件数" column="count" {...{sortKey,direction}} onSort={sortBy} />
          <th className="p-3">資料例</th>
        </tr></thead>
        <tbody>{sorted.map(item => (
          <tr key={item.label} className="border-b">
            <td className="p-3 font-medium">{item.label}</td>
            <td className="p-3 tabular-nums">{item.count}</td>
            <td className="p-3"><div className="flex flex-wrap gap-3">{item.example.map((pdf, i) => <Link key={pdf} to={`/test/${encodeURIComponent(pdf)}`} className="text-[var(--color-brand-green)] underline">例{i + 1}</Link>)}</div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
export function SourcesPage() {
  const data = useMemo(() => {
    const kinds = ['問題', '解答', '音源'];
    const groups = new Map<string, Map<string, { count: number; example: string[] }>>();
    const empty = { missing: 0, documented: 0, count: testDatabase.length };
    for (const record of testDatabase) {
      const notes = getTestDetails(record.questionPdf)?.specialNotes || '';
      const sources = extractSources(notes);
      if (!sources.length) { empty.missing++; continue; }
      empty.documented++;
      for (const item of sources) {
        const map = groups.get(item.kind) ?? new Map();
        const entry = map.get(item.source) ?? { count: 0, example: [] };
        entry.count++;
        if (entry.example.length < 4) entry.example.push(record.questionPdf);
        map.set(item.source, entry);
        groups.set(item.kind, map);
      }
    }
    const tables: SourceGroup[] = kinds.map(kind => ({
      kind,
      sources: [...(groups.get(kind) ?? new Map()).entries()]
        .map(([label, v]) => ({ label, ...v }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ja')),
    }));
    return { summary: empty, tables };
  }, []);
  return (
    <>
      <SEOMeta path="/sources" title="収録資料の出典一覧・来歴｜共通テスト過去問総集"
        description="過去問資料の問題・解答・音源ごとの出典記録を集計。大学入試センター、国立国会図書館等の記録と照合できる目録。" />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-6xl text-gray-800 leading-relaxed">
          <h1 className="text-2xl font-bold mb-4">収録資料の出典記録</h1>
          <p className="mb-4">問題、解答、リスニング音源について、試験詳細の「特記事項」に記録された提供元を集計しました。歴史的な試験資料の所在や伝達経路を調べるための目録です。収録レコードから自動生成するため、データの追記に応じて結果が変わります。</p>
          <p className="mb-5">対象レコード：<strong>{data.summary.count.toLocaleString('ja-JP')}件</strong> ／ 出典の記載あり：<strong>{data.summary.documented.toLocaleString('ja-JP')}件</strong> ／ 記載なし：<strong>{data.summary.missing.toLocaleString('ja-JP')}件</strong></p>
          <p className="text-sm mb-6 border-l-4 border-gray-300 pl-3">重要：これはサイト内の出典表記を集計したもので、提供元が本サイトによる転載・再配布を許諾したことを示すものではありません。また、出典の記載がない資料も、提供元が存在しないことを意味しません。正確な出典の確認や権利に関する連絡は、右下のヘルプ窓口へお願いします。</p>
          {data.tables.map(table => (
            <section key={table.kind} className="mb-7">
              <h2 className="text-xl font-bold mb-2">{table.kind}の出典記録</h2>
              <SourceTable items={table.sources} />
            </section>
          ))}
          <h2 className="text-lg font-bold mb-2">収録情報の整理方法</h2>
          <p className="mb-3">出典名は掲載記録の表記を原則として維持し、同一団体を勝手に統合しません。1つの試験について問題と解答の出典が異なる場合は別々に集計します。記載のない資料を推測で補完することはありません。</p>
          <p><Link to="/coverage" className="text-[var(--color-brand-green)] underline">年度別の記録状況</Link> ／ <Link to="/about" className="text-[var(--color-brand-green)] underline">サイトと資料の取り扱い</Link></p>
        </article>
      </div>
    </>
  );
}
