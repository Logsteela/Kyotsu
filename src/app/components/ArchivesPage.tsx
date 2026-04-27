'use client';

import archivesTables from './archivesTables.json';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { SEOMeta } from '@/app/components/SEOMeta';
import { StructuredData } from '@/app/components/StructuredData';

interface RankingItem {
  rank: number;
  item1: string;
  item2: string;
}

interface ArchivesTable {
  id: string;
  title: string;
  data: RankingItem[];
}

interface RankingTableProps {
  title: string;
  data: RankingItem[];
}

function RankingTable({ title, data }: RankingTableProps) {
  const tableBoxRef = useRef<HTMLDivElement | null>(null);
  const [tableWidth, setTableWidth] = useState<number>(0);

  // 表（枠）の実幅を監視して、タイトルの幅を「表幅」に固定する
  useLayoutEffect(() => {
    const el = tableBoxRef.current;
    if (!el) return;

    let raf = 0;

    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // offsetWidth: ボーダー込みの見た目の幅
        const w = el.offsetWidth;
        setTableWidth((prev) => (prev !== w ? w : prev));
      });
    };

    measure();

    // ResizeObserver で内容変化・フォント・ウィンドウサイズ変化にも追従
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    // ★カードは内容に合わせて横に伸びる（表幅基準）。
    //   タイトルは tableWidth に固定するので、タイトルがカード幅を押し広げない。
    <div className="bg-white rounded-lg border border-[var(--color-table-border)] p-5 flex flex-col gap-3 w-max min-w-[340px] shrink-0">
      {/* ★タイトルは「表幅」に合わせる。表より長いぶんだけ折り返す */}
      <h3
        className="text-base font-semibold text-gray-900 whitespace-normal break-words [overflow-wrap:anywhere]"
        style={tableWidth ? { width: `${tableWidth}px` } : undefined}
      >
        {title}
      </h3>

      {/* ★ここが“幅の基準”になる枠。w-max で表の内容に応じて伸びる */}
      <div ref={tableBoxRef} className="border border-[var(--color-table-border)] rounded overflow-hidden inline-block w-max">
        {/* ★表は内容に合わせて伸びる。折り返しは一切しない */}
        <table className="table-auto w-max">
          <thead className="bg-[var(--color-table-header-bg)] border-b border-[var(--color-table-border)]">
            <tr>
              <th className="text-center p-2 text-xs sm:text-sm font-semibold text-gray-700 border-r border-[var(--color-table-border)] w-[50px] whitespace-nowrap">
                順位
              </th>
              <th className="text-left p-2 text-xs sm:text-sm font-semibold text-gray-700 border-r border-[var(--color-table-border)] whitespace-nowrap">
                教科
              </th>
              <th className="text-left p-2 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                点数
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr className="border-b border-[var(--color-table-border)] last:border-b-0">
                <td className="p-2 text-xs sm:text-sm text-gray-500 whitespace-nowrap" colSpan={3}>
                  データなし
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={`${item.rank}-${index}`}
                  className={`border-b border-[var(--color-table-border)] last:border-b-0 ${
                    index % 2 === 0 ? 'bg-[var(--color-state-normal)]' : 'bg-[var(--color-state-normal-alt)]'
                  }`}
                >
                  <td className="text-center p-2 text-xs sm:text-sm text-gray-700 border-r border-[var(--color-table-border)] whitespace-nowrap">
                    {item.rank}
                  </td>
                  <td className="text-left p-2 text-xs sm:text-sm text-gray-700 border-r border-[var(--color-table-border)] whitespace-nowrap">
                    {item.item1}
                  </td>
                  <td className="text-left p-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                    {item.item2}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ArchivesPage() {
  const tables = archivesTables as unknown as ArchivesTable[];
  const title = '記録資料集 - 共通テスト過去問総集';
  const description = '共通テスト・センター試験・共通一次試験の記録資料集です。';

  return (
    <>
      <SEOMeta
        title={title}
        description={description}
        path="/archives"
        keywords="共通テスト,センター試験,共通一次,記録資料集,平均点,得点,順位"
      />
      <StructuredData
        type="WebPage"
        pageTitle={title}
        pageDescription={description}
        pagePath="/archives"
      />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <div className="w-full max-w-none mx-auto">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">記録資料集</h1>

          {/* ★空いてる限り横に並べる */}
          <div className="flex flex-wrap gap-6 items-start">
            {tables.map((t) => (
              <RankingTable key={t.id} title={t.title} data={t.data} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
