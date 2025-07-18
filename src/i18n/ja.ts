export default {
  common: {
    home: "ホーム",
    back: "戻る",
  },
  home: {
    title: "画像クイズ表示ツール",
    zoomerMode: "ズームアウトクイズ",
    panelMode: "パネルクイズ",
  },
  notification: {
    added: "画像が読み込まれました",
    updated: "同じ画像が既に存在します",
    error: "画像の読み込みに失敗しました",
    exported: "エクスポートに成功しました",
    imported: "インポートに成功しました",
    cancel: "操作がキャンセルされました",
    "export-confirm":
      "一部の画像にはまだ選択領域がありません。これらの画像にランダムな領域を選択してエクスポートしますか？",
    "mode-mismatch":
      "インポートされたデータが現在のモードと一致しません。データを読み込めません。",
  },
  buttons: {
    confirm: "確認",
    cancel: "キャンセル",
  },
  aria: {
    homeButton: "ホームに戻る",
    imageUpload: "画像をアップロード",
    selectMode: "モードを選択",
  },
  mode: {
    random: "ランダム",
    linear: "各行・各列",
    spiral: "渦巻き",
    direction: {
      right: "右",
      left: "左",
      down: "下",
      up: "上",
      clockwise: "時計回り",
      counterClockwise: "反時計回り",
    },
    position: {
      topLeft: "左上から",
      topRight: "右上から",
      bottomRight: "右下から",
      bottomLeft: "左下から",
      center: "中心から",
    },
  },
  panel: {
    selectMode: "モード変更",
    directionPriority: "順番変更",
    directionAndStart: "方向と開始位置",
    manual: "手動めくり",
    auto: "自動めくり",
  },
  zoomer: {
    showFullImage: "画像全体を表示",
    showSelectedArea: "選択領域のみ表示",
    hideImage: "画像を非表示",
  },
};
