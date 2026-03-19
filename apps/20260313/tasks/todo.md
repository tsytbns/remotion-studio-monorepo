# Todo

## Plan

- [x] 既存の `AuctionModernLegacy` composition とレンダリング導線を確認する
- [x] `AuctionModernLegacy` の縦長 FHD (`1080x1920`) composition を追加する
- [x] 縦長 FHD 版を呼び出せるレンダースクリプトを追加する
- [x] lint と実レンダリングで変更を検証する

## Notes

- `AuctionModernLegacy` は現在 `1080x1350` のみ `Studies` フォルダで登録されている
- 今回は既存 4:5 版を維持しつつ、9:16 の別 composition を追加する
- 高さに応じてバナー、タイトル、サブタイトルのスケールを微調整し、4:5 と 9:16 の両方で間延びを抑える
- 追加要件: 縦長 FHD 版は `Modern Legacy` と英字サブコピーを出さず、スプラッシュロゴのみ表示する

## Review

- `pnpm run lint` 成功
- `pnpm run build:auction-modern-legacy-vertical-fhd` 成功
- 生成物: `out/auction-modern-legacy-vertical-fhd.mp4`
- 中央フレームを `out/auction-modern-legacy-vertical-fhd-frame90.png` に抽出して確認し、縦長 FHD 版がスプラッシュロゴのみ表示であることを目視確認
