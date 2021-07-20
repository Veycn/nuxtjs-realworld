
import path from 'path'

export default function (moduleOptions) {
  this.addPlugin(path.resolve(__dirname, '../utils/require.js'))
}