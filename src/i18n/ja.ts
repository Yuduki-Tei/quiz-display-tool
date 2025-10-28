export default {
  common: {
    home: "ホーム",
    back: "戻る",
  },
  home: {
    imageQuiz: "画像クイズ表示ツール",
    textQuiz: "文字クイズ表示ツール",
    zoomerMode: "ズームアウトクイズ",
    panelMode: "パネルクイズ",
  },
  notification: {
    added: "データが読み込まれました",
    updated: "同じデータが既に存在します",
    error: "データの読み込みに失敗しました",
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
    imageUpload: "データをアップロード",
    selectMode: "モードを選択",
  },
  sidebar: {
    addItem: "項目を追加",
    openSidebar: "サイドバーを開く",
    delete: "削除",
    import: "ファイルをインポート",
    export: "ファイルをエクスポート",
  },
  topbar: {
    previous: "前へ",
    next: "次へ",
    hideAll: "すべて隠す",
    showAll: "すべて表示",
    play: "開始",
    pause: "一時停止",
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
    manual: "手動めくりモード中",
    auto: "自動めくりモード中",
  },
  zoomer: {
    showFullImage: "画像全体表示中",
    showSelectedArea: "選択領域表示中",
    hideImage: "画像非表示中",
  },
  letter: {
    selectMode: "モード変更",
    manual: "手動めくりモード中",
    auto: "自動めくりモード中",
    charsPerRow: "一行あたりの文字数",
    random: "ランダム",
    sequential: "順番",
    reverse: "逆順",
  },
};
