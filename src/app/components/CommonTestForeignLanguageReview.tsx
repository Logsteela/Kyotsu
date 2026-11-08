import { COMMON_TEST_2026_FOREIGN_LANGUAGES } from '@/app/data/commonTest2026ForeignLanguages';
import { COMMON_TEST_2025_FOREIGN_LANGUAGES } from '@/app/data/commonTest2025ForeignLanguages';
import { getDifficultyAppropriateness } from '@/app/data/commonTest2026Evaluations';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import { getEnhancedDatabase } from '@/app/data/testDatabase';

export function CommonTestForeignLanguageReview({ year, subject }: { year:number|string; subject:string }) {
  const research = year === 2026 ? COMMON_TEST_2026_FOREIGN_LANGUAGES[subject] : year === 2025 ? COMMON_TEST_2025_FOREIGN_LANGUAGES[subject] : null;
  if (!research) return null;
  const prior = getEnhancedDatabase().find(r => r.year === 2025 && r.testType === 'main' && r.subject === subject);
  const recent = getEnhancedDatabase().find(r => r.year === 2026 && r.testType === 'main' && r.subject === subject);
  const oldScore = prior && getTestDetails(prior.questionPdf);
  const newScore = recent && getTestDetails(recent.questionPdf);
  const difference = typeof oldScore?.averageScore === 'number' && typeof newScore?.averageScore === 'number'
    ? newScore.averageScore - oldScore.averageScore : null;
  return <section aria-label={`${year}年度の出題と問題評価`} className="mt-6 border-t pt-5">
    <h3 className="text-lg font-semibold mb-3">{year}年度・大問別の出題内容と問題評価</h3>
    {year === 2026 && <p className="text-xs text-gray-600 mb-3">外部評価分科会の評価：{getDifficultyAppropriateness(subject)}／4</p>}
    <div className="space-y-3 mb-5">
      {research.sections.map(p => <div key={p.number} className="border-b border-gray-100 pb-3">
        <h4 className="font-semibold text-sm mb-1">第{p.number}問：{p.topic}</h4>
        <p className="text-sm leading-relaxed text-gray-700">{p.summary}</p>
      </div>)}
    </div>
    <h4 className="font-semibold mb-2">問題評価</h4>
    <p className="text-sm leading-relaxed mb-3">{research.observation}</p>
    <h4 className="font-semibold mb-2">個別設問</h4>
    <p className="text-sm leading-relaxed mb-3">{research.specific}</p>
    {year === 2026 && difference !== null && <p className="text-sm mb-3 bg-gray-50 border rounded p-3">
      科目平均点の前年差：<strong>{difference > 0 ? '+' : ''}{difference.toFixed(2)}点</strong>（2025年度から2026年度）
    </p>}
  </section>;
}
