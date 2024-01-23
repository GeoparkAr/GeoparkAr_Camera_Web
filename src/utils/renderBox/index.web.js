import labels from "../labels.json";
import infos from "../infos.json";
import { Colors } from "../utils";

export var posText = 0;
export function onTap(){
  
  posText = posText +1;

}

function drawText(ctx, textHeight, text, xF, yF, maxWidth) {
  let words = text.split(' ');
  let line = '';
  let lines = [];
  const lineHeight = textHeight * 1.2; // Espaçamento entre linhas

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;

    if (testWidth + xF > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
    lines.push(line);

  //ctx.fillStyle = Colors.hexToRgba("#000000", 0.6);
  //ctx.fillRect(xF, yF, maxWidth, lines.length * lineHeight);
  //ctx.fillStyle = "#FFFFFF";

  for (let i = 0; i < lines.length; i++) {
    ctx.fillStyle = Colors.hexToRgba("#000000", 0.6);
    ctx.fillRect(xF, yF + i * lineHeight, ctx.measureText(lines[i]).width, lineHeight);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(lines[i], xF, yF + i * lineHeight);
    ctx.fill();
    console.log("passou aqui")
  };
}
/**
 * Render prediction boxes
 * @param {CanvasRenderingContext2D} ctx canvas rendering context
 * @param {number} classThreshold class threshold
 * @param {Array} boxes_data boxes array
 * @param {Array} scores_data scores array
 * @param {Array} classes_data class array
 * @param {Array[Number]} ratios boxes ratio [xRatio, yRatio]
 */


export const renderBoxes = (ctx, classThreshold, boxes_data, scores_data, classes_data, ratios) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas

  

  // font configs
  const font = `${Math.max(
    Math.round(Math.max(ctx.canvas.width, ctx.canvas.height) / 40),
    14
  )}px Arial`;
  ctx.font = font;
  ctx.textBaseline = "top";

  const colors = new Colors();

  for (let i = 0; i < scores_data.length; ++i) {
    // filter based on class threshold
    if (scores_data[i] > classThreshold) {
      const klass = infos[classes_data[i]][posText];
      const color = colors.get(classes_data[i]);
      const score = (scores_data[i] * 100).toFixed(1);

      let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
      x1 *= ctx.canvas.width * ratios[0];
      x2 *= ctx.canvas.width * ratios[0];
      y1 *= ctx.canvas.height * ratios[1];
      y2 *= ctx.canvas.height * ratios[1];
      const width = x2 - x1;
      const height = y2 - y1;

      // draw box.
      //ctx.fillStyle = Colors.hexToRgba(color, 0.2);
      //ctx.fillRect(x1, y1, width, height);
      // draw border box.
      //ctx.strokeStyle = color;
      //ctx.lineWidth = Math.max(Math.min(ctx.canvas.width, ctx.canvas.height) / 200, 2.5);
      //ctx.strokeRect(x1, y1, width, height);

      // Draw the label background.
      ctx.fillStyle = color;
      const textWidth = ctx.measureText(klass + " - " + score + "%").width;
      const textHeight = parseInt(font, 10); // base 10
      const yText = y1 - (textHeight + ctx.lineWidth);
      /*ctx.fillRect(
        x1 - 1,
        yText < 0 ? 0 : yText, // handle overflow label box
        textWidth + ctx.lineWidth,
        textHeight + ctx.lineWidth
      );*/

      // Draw labels
      ctx.fillStyle = "#ffffff";
      //ctx.fillText(klass, x1 - 1, yText < 0 ? 0 : yText);
      if(posText >= infos[classes_data[i]].length){
        posText = 0;
      }
      var tt = (posText + 1).toString() + "/" + infos[classes_data[i]].length.toString()
      ctx.fillText( tt, 50,ctx.canvas.width - 100, ctx.canvas.width);
      drawText(ctx, textHeight, infos[classes_data[i]][posText], x1 , y1, ctx.canvas.width);
    }
  } 
};
