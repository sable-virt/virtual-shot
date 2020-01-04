import { Filter } from 'konva/types/Node'
const ColorMatrix: (matrix: number[][]) => Filter = matrix => imageData => {
  const buf = imageData.data
  for (let i = 0, n = buf.length; i < n; i += 4){
    const R = buf[i];
    const G = buf[i + 1];
    const B = buf[i + 2];
    const A = buf[i + 3];
    buf[i]   = matrix[0][0] * R + matrix[0][1] * G + matrix[0][2] * B + matrix[0][3] * A + matrix[0][4] * 255;
    buf[i+1] = matrix[1][0] * R + matrix[1][1] * G + matrix[1][2] * B + matrix[1][3] * A + matrix[1][4] * 255;
    buf[i+2] = matrix[2][0] * R + matrix[2][1] * G + matrix[2][2] * B + matrix[2][3] * A + matrix[2][4] * 255;
    buf[i+3] = matrix[3][0] * R + matrix[3][1] * G + matrix[3][2] * B + matrix[3][3] * A + matrix[3][4] * 255;
  }
}
export default ColorMatrix
