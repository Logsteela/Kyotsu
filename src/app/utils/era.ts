 // 西暦を元号表記に変換する関数
export function getEraDisplay(year: number): string {
  if (year === 2019) {
    // 2019年度は平成31年度
    return '平成31年度';
  } else if (year >= 2020) {
    const reiwaYear = year - 2018;
    return `令和${reiwaYear}年度`;
  } else if (year >= 1989) {
    const heiseiYear = year - 1988;
    return heiseiYear === 1 ? '平成元年度' : `平成${heiseiYear}年度`;
  } else if (year >= 1926) {
    const showaYear = year - 1925;
    return showaYear === 1 ? '昭和元年度' : `昭和${showaYear}年度`;
  }
  return `${year}年度`;
}

// 西暦と元号を併記
export function getYearWithEra(year: number): string {
  return `${year}年度（${getEraDisplay(year)}）`;
}