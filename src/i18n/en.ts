export default {
  common: {
    home: "Home",
    back: "Back",
  },
  home: {
    imageQuiz: "Image Quiz Display Tool",
    textQuiz: "Text Quiz Display Tool",
    zoomerMode: "Zoom Out Mode",
    panelMode: "Panel Mode",
  },
  notification: {
    added: "File loaded",
    updated: "Same file already exists",
    error: "Failed to load file",
    exported: "Export successful",
    imported: "Import successful",
    cancel: "Operation cancelled",
    "export-confirm":
      "Some images do not have selected areas. Would you like to randomly select areas for these images and export?",
    "mode-mismatch":
      "Imported data does not match current mode. Unable to load data.",
  },
  buttons: {
    confirm: "Confirm",
    cancel: "Cancel",
  },
  aria: {
    homeButton: "Return to home",
    fileUpload: "Upload image",
    selectMode: "Select mode",
  },
  mode: {
    random: "Random",
    linear: "Linear",
    spiral: "Spiral",
    direction: {
      right: "Right",
      left: "Left",
      down: "Down",
      up: "Up",
      clockwise: "Clockwise",
      counterClockwise: "Counter-clockwise",
    },
    position: {
      topLeft: "from Top-left",
      topRight: "from Top-right",
      bottomRight: "from Bottom-right",
      bottomLeft: "from Bottom-left",
      center: "from Center",
    },
  },
  panel: {
    selectMode: "Select reveal mode",
    directionPriority: "Direction priority",
    directionAndStart: "Direction and start point",
    manual: "Manual reveal",
    auto: "Auto reveal",
  },
  zoomer: {
    showFullImage: "Show full image",
    showSelectedArea: "Show selected area only",
    hideImage: "Hide image",
  },
  letter: {
    selectMode: "Select reveal mode",
    manual: "Manual reveal",
    auto: "Auto reveal",
    charsPerRow: "Characters per row",
    random: "Random",
    sequential: "Sequential",
    reverse: "Reverse",
  },
};
