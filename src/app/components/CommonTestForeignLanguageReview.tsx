import { COMMON_TEST_2026_FOREIGN_LANGUAGES } from '@/app/data/commonTest2026ForeignLanguages';
import { getDifficultyAppropriateness } from '@/app/data/commonTest2026Evaluations';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import { getEnhancedDatabase } from '@/app/data/testDatabase';

export function CommonTestForeignLanguageReview({ year, subject }: { year:number|string; subject:string }) {
  if (year !== 2026) return null;
  const research = COMMON_TEST_2026_FOREIGN_LANGUAGES[subject];
  if (!research) return null;
  const prior = getEnhancedDatabase().find(r => r.year === 2025 && r.testType === 'main' && r.subject === subject);
  const recent = getEnhancedDatabase().find(r => r.year === 2026 && r.testType === 'main' && r.subject === subject);
  const oldScore = prior && getTestDetails(prior.questionPdf);
  const newScore = recent && getTestDetails(recent.questionPdf);
  const difference = typeof oldScore?.averageScore === 'number' && typeof newScore?.averageScore === 'number'
    ? newScore.averageScore - oldScore.averageScore : null;
  return <section aria-label="2026年度の出題と問題評価" className="mt-6 border-t pt-5">
    <h3 className="text-lg font-semibold mb-3">2026年度・大問別の出題内容と問題評価</h3>
    <p className="text-xs text-gray-600 mb-3">高校教員による「難易度の適正さ」評価：{getDifficultyAppropriateness(subject)}／4（問題が難しいほど高くなる値ではありません）</p>
    <p className="text-sm leading-relaxed mb-4">
      大学入試センターが公開した高校教員による問題評価を読み、各大問で必要だった知識・判断と、
      問題の負荷について整理しました。大問別の実測得点率は未照合のため掲載せず、
      出題内容の分析と科目全体の平均点を分けて示します。
    </p>
    <div className="space-y-3 mb-5">
      {research.sections.map(p => <div key={p.number} className="border-b border-gray-100 pb-3">
        <h4 className="font-semibold text-sm mb-1">第{p.number}問：{p.topic}</h4>
        <p className="text-sm leading-relaxed text-gray-700">{p.summary}</p>
      </div>)}
    </div>
    <h4 className="font-semibold mb-2">問題評価から読み取れること</h4>
    <p className="text-sm leading-relaxed mb-3">{research.observation}</p>
    <h4 className="font-semibold mb-2">検討を要する設問と考え方</h4>
    <p className="text-sm leading-relaxed mb-3">{research.specific}</p>
    {difference !== null && <p className="text-sm mb-3 bg-gray-50 border rounded p-3">
      科目平均点の前年差：<strong>{difference > 0 ? '+' : ''}{difference.toFixed(2)}点</strong>（2025年度から2026年度）
    </p>}
    <p className="text-sm leading-relaxed mb-3">{research.caution}</p>
    <p className="text-xs text-gray-600">
      大問の主観的な「難しい」という評価は、受験者の実測正答率とは別の情報です。
      元の問題評価報告書と集計方法は「資料の出典」にまとめています。
    </p>
  </section>;
}
