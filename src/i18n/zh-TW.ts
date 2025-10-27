export default {
  common: {
    home: "首頁",
    back: "返回",
  },
  home: {
    title: "Quiz顯示工具",
    imageQuiz: "圖片Quiz顯示工具",
    textQuiz: "文字Quiz顯示工具",
    zoomerMode: "縮放模式",
    panelMode: "面板模式",
  },
  notification: {
    added: "圖片已載入",
    updated: "相同圖片已存在",
    error: "載入圖片失敗",
    exported: "匯出成功",
    imported: "匯入成功",
    cancel: "已取消操作",
    "export-confirm":
      "有部分圖片尚未框選區域。是否要為這些圖片隨機選取一塊區域後匯出？",
    "mode-mismatch": "導入的資料與當前模式不符。無法載入資料。",
  },
  buttons: {
    confirm: "確認",
    cancel: "取消",
  },
  aria: {
    homeButton: "返回首頁",
    imageUpload: "上傳圖片",
    selectMode: "選擇模式",
  },
  mode: {
    random: "隨機",
    linear: "線性",
    spiral: "螺旋",
    direction: {
      right: "向右",
      left: "向左",
      down: "向下",
      up: "向上",
      clockwise: "順時針",
      counterClockwise: "逆時針",
    },
    position: {
      topLeft: "左上開始",
      topRight: "右上開始",
      bottomRight: "右下開始",
      bottomLeft: "左下開始",
      center: "中心開始",
    },
  },
  panel: {
    selectMode: "選擇翻面模式",
    directionPriority: "方向優先度",
    directionAndStart: "方向與起點",
    manual: "手動翻面",
    auto: "自動翻面",
  },
  zoomer: {
    showFullImage: "顯示完整圖片",
    showSelectedArea: "只顯示框選區域",
    hideImage: "隱藏圖片",
  },
  letter: {
    selectMode: "選擇揭露模式",
    manual: "點擊揭露",
    auto: "自動揭露",
    charsPerRow: "每行字數",
    random: "隨機",
    sequential: "順序",
    reverse: "倒序",
  },
};
