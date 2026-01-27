# PDFファイル格納フォルダ

このフォルダには、各年度・教科のテスト問題と解答のPDFファイルを配置してください。

## データベース構造

データベース(`/src/app/data/testDatabase.ts`)は以下の形式で管理されています：

```typescript
{
  year: 2025,
  testType: 'main',
  actualSubject: '国語',
  priority: 1,
  questionPdfName: '2025kokugo.pdf',
  answerPdfName: '2025kokugo_ans.pdf',
  pdfState: 1  // 1=正常, 2=一部欠損, 3=完全欠損
}
```

## ファイル命名規則

### 問題PDF
`questionPdfName`に指定したファイル名を使用してください。

例：
- `2025kokugo.pdf` - 2025年度国語本試験
- `2025kokugo_makeup.pdf` - 2025年度国語追試験

### 解答PDF
`answerPdfName`に指定したファイル名を使用してください。

例：
- `2025kokugo_ans.pdf` - 2025年度国語本試験解答
- `2025kokugo_makeup_ans.pdf` - 2025年度国語追試験解答

## PDF状態（pdfState）

- **1（正常）**: PDFファイルが完全に揃っている
- **2（一部欠損）**: 一部のページが欠けている（黄色背景で表示）
- **3（完全欠損）**: PDFファイルが存在しない（赤色背景、ボタン非表示）

## ディレクトリ構造

```
/public/pdfs/
├── README.md (このファイル)
├── 2025kokugo.pdf
├── 2025kokugo_ans.pdf
├── 2025math1a.pdf
├── 2025math1a_ans.pdf
└── ...
```

## 使い方

1. PDFファイルをこのフォルダに配置
2. `/src/app/data/testDatabase.ts`にデータを追加
3. アプリケーションで自動的に閲覧・ダウンロード可能になります

## 注意事項

- ファイル名は半角英数字とアンダースコア、ハイフン、ピリオドのみ使用推奨
- ファイル名は大文字小文字を区別します
- データベースに登録したファイル名と実際のファイル名が完全に一致する必要があります
