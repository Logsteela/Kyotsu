import { useState } from 'react';

type Props = {
  year: number | string;
  testType: 'main' | 'makeup';
  subject: string;
  average?: number;
  maxScore?: number;
  standardDeviation?: number;
};

export function ExamScoreCalculator({ year, testType, subject, average, maxScore, standardDeviation }: Props) {
  const [value, setValue] = useState('');
  if (typeof year !== 'number' || year < 2021 || year > 2026 || testType !== 'main' ||
      typeof average !== 'number' || typeof maxScore !== 'number' || maxScore <= 0 ||
      typeof standardDeviation !== 'number' || standardDeviation <= 0) return null;
  const score = value.trim() !== '' ? Number(value) : NaN;
  const valid = Number.isFinite(score) && score >= 0 && score <= maxScore;
  const deviation = valid ? 50 + 10 * (score - average) / standardDeviation : null;
  const difference = valid ? score - average : null;
  return (
    <details className="mt-5 border border-gray-200 rounded-lg p-4 sm:p-5 bg-white text-gray-800">
      <summary className="font-semibold cursor-pointer select-none">自分の得点と、この本試験の平均を比較する</summary>
      <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-3">
        {year}年度の{subject}本試験で取得した点数を入力すると、サイトに登録されている平均点・標準偏差から
        平均点との差と計算上の偏差値を表示します。結果はこのページ内だけで計算し、サーバーに送信しません。
      </p>
      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label htmlFor="exam-score-input" className="block text-sm font-semibold mb-1">自分の得点（0～{maxScore}点）</label>
          <input id="exam-score-input" type="number" inputMode="decimal" min="0" max={maxScore}
            step="any" value={value} onChange={e => setValue(e.target.value)}
            className="bg-white border border-gray-300 rounded p-2 w-44" placeholder="得点を入力" />
        </div>
        <span className="text-sm text-gray-600 pb-2">平均点：{average}点 ／ 標準偏差：{standardDeviation}点</span>
      </div>
      {value !== '' && !valid && <p role="alert" className="text-sm mb-3 text-red-700">0～{maxScore}点の範囲で数字を入力してください。</p>}
      {valid && deviation !== null && difference !== null && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 border rounded p-3">
            <div className="text-xs text-gray-600">平均点との差</div>
            <div className="font-bold text-lg tabular-nums">{difference > 0 ? '+' : ''}{difference.toFixed(2)}点</div>
          </div>
          <div className="bg-gray-50 border rounded p-3">
            <div className="text-xs text-gray-600">得点率</div>
            <div className="font-bold text-lg tabular-nums">{(score / maxScore * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-gray-50 border rounded p-3">
            <div className="text-xs text-gray-600">偏差値（計算値）</div>
            <div className="font-bold text-lg tabular-nums">{deviation.toFixed(1)}</div>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-600 leading-relaxed">
        偏差値＝50＋10×（得点－平均点）÷標準偏差。実際の成績の順位・上位何％かはこの式からは分かりません。
        科目の成績分布が正規分布に近いとは限らず、受験者集団や集計時点によって変わります。
      </p>
    </details>
  );
}
