import { useMemo } from 'react';
import { CommonTestQuestionDetails } from '@/app/components/CommonTestQuestionDetails';
import { CommonTest2025QuestionDetails } from '@/app/components/CommonTest2025QuestionDetails';
import { CommonTestForeignLanguageReview } from '@/app/components/CommonTestForeignLanguageReview';
import { Link } from 'react-router';
import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';

type Comparison = { year: number; average: number; rate: number; examinees: number | null; questionPdf: string };
type Props = { year: number | string; subject: string; examType: 'main' | 'makeup'; questionPdf: string };

function useComparisons(subject: string, questionPdf: string, max: number | null) {
  return useMemo(() => {
    const groups = new Map<number, Comparison[]>();
    const seen = new Set<string>();
    for (const r of getEnhancedDatabase()) {
      if (r.testType !== 'main' || typeof r.year !== 'number' || r.year < 2021 || r.year > 2026 ||
          r.subject !== subject || seen.has(r.questionPdf)) continue;
      seen.add(r.questionPdf);
      const d = getTestDetails(r.questionPdf);
      if (typeof d?.averageScore !== 'number' || typeof d.totalScore !== 'number' ||
          d.totalScore <= 0 || (max !== null && d.totalScore !== max)) continue;
      const item: Comparison = {
        year: r.year, average: d.averageScore, rate: d.averageScore / d.totalScore * 100,
        examinees: typeof d.examinees === 'number' ? d.examinees : null, questionPdf: r.questionPdf,
      };
      groups.set(r.year, [...(groups.get(r.year) ?? []), item]);
    }
    // 同年度の本試験が複数ある場合は、通常の日程を特定できないので比較から除く
    return [...groups].filter(([, arr]) => arr.length === 1).map(([, arr]) => arr[0])
      .sort((a, b) => b.year - a.year);
  }, [subject, questionPdf, max]);
}

export function CommonTestMainInsights({ year, subject, examType, questionPdf }: Props) {
  const current = getTestDetails(questionPdf);
  const max = typeof current?.totalScore === 'number' && current.totalScore > 0 ? current.totalScore : null;
  const comparisons = useComparisons(subject, questionPdf, max);
  const { sorted, sortKey, direction, sortBy } = useSortedRows(comparisons, 'year');
  if (typeof year !== 'number' || year < 2021 || year > 2026 || examType !== 'main') return null;
  const currentRate = typeof current?.averageScore === 'number' && max !== null
    ? current.averageScore / max * 100 : null;
  const prior = comparisons.find(p => p.year === year - 1);
  const difference = prior && currentRate !== null ? currentRate - prior.rate : null;
  const currentIndex = comparisons.findIndex(c => c.questionPdf === questionPdf);
  const order = currentIndex >= 0 && comparisons.length >= 3
    ? 1 + comparisons.filter(p => p.rate > comparisons[currentIndex].rate).length : null;
  return (
    <section aria-labelledby="exam-research-title" className="mt-6 border border-[var(--color-table-border)] bg-white rounded-lg p-5 sm:p-6 text-gray-800">
      <h2 id="exam-research-title" className="text-lg font-bold mb-3">この本試験の統計と過去問比較</h2>
      <p className="text-sm leading-relaxed mb-4">
        {year}年度の{subject}を、同名の本試験がある年度と照合しています。満点が異なる場合は同じ表に混ぜず、
        平均点÷満点から平均得点率を計算しています。数値はサイトの試験情報データベースに基づきます。
      </p>
      {currentRate !== null && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-gray-50 rounded p-3 border">
            <div className="text-xs text-gray-600">平均得点率</div>
            <div className="text-xl font-bold tabular-nums">{currentRate.toFixed(2)}%</div>
            <div className="text-xs text-gray-600">{current?.averageScore}点／{max}点</div>
          </div>
          <div className="bg-gray-50 rounded p-3 border">
            <div className="text-xs text-gray-600">前年との差（同名・同満点）</div>
            <div className="text-xl font-bold tabular-nums">{difference === null ? '比較不可' : `${difference > 0 ? '+' : ''}${difference.toFixed(2)}pt`}</div>
            <div className="text-xs text-gray-600">{prior ? `${prior.year}年度を基準` : '比較可能な前年データなし'}</div>
          </div>
          <div className="bg-gray-50 rounded p-3 border">
            <div className="text-xs text-gray-600">収録比較年度中の平均得点率順位</div>
            <div className="text-xl font-bold tabular-nums">{order === null ? '—' : `${order}位／${comparisons.length}件`}</div>
            <div className="text-xs text-gray-600">難易度順位ではありません</div>
          </div>
        </div>
      )}
      {comparisons.length >= 2 && (
        <>
          <h3 className="text-base font-semibold mb-2">同じ科目名・満点の年度別記録</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left">
              <thead><tr className="bg-gray-50 border-b">
                <SortHeader label="年度" column="year" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="平均点" column="average" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="平均得点率" column="rate" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="受験者数" column="examinees" {...{sortKey,direction}} onSort={sortBy} />
                <th className="p-3">過去問</th>
              </tr></thead>
              <tbody>{sorted.map(p => (
                <tr key={p.questionPdf} className={`border-b ${p.questionPdf === questionPdf ? 'bg-gray-50 font-semibold' : ''}`}>
                  <td className="p-3">{p.year}</td><td className="p-3 tabular-nums">{p.average}</td>
                  <td className="p-3 tabular-nums">{p.rate.toFixed(2)}%</td>
                  <td className="p-3 tabular-nums">{p.examinees === null ? '—' : p.examinees.toLocaleString('ja-JP')}</td>
                  <td className="p-3"><Link className="text-[var(--color-brand-green)] underline" to={`/test/${encodeURIComponent(p.questionPdf)}`}>{p.questionPdf === questionPdf ? 'この試験' : '資料を見る'}</Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
      <CommonTestQuestionDetails year={year} subject={subject} />
      <CommonTest2025QuestionDetails year={year} subject={subject} />
      <CommonTestForeignLanguageReview year={year} subject={subject} />
      <p className="text-xs text-gray-600 leading-relaxed mt-4">
        注：平均点や得点率は受験者集団・科目構成・得点調整等の影響を受けます。同じ科目名でも年度により出題範囲や方式が異なる場合があります。
        比較可能な年度が複数あっても、得点率だけから問題難易度の優劣は確定できません。
      </p>
    </section>
  );
}
