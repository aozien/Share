import React from 'react'
import Box from '@mui/material/Box'
import {grey} from '@mui/material/colors'
import {useState, useEffect} from 'react'


const FPSDisplayer = () => {
  const [fps, setFps] = useState(0)
  useEffect(() => {
    const duration = 1000
    let frameCount = 0
    let timeStamp = performance.now()
    const precision = 2
    requestAnimationFrame(function render() {
      requestAnimationFrame(render)
      frameCount++
      const diff = performance.now() - timeStamp
      if (diff >= duration) {
        const result = frameCount * duration / diff
        const roundedFps = roundToDecimal(result, precision)
        // console.log('fps :>> ', roundedFps)
        setFps(roundedFps)
        timeStamp = performance.now()
        frameCount = 0
      }
    })
  }, [])

  return (
    <Box sx={{
      width: 100,
      bgcolor: grey[100],
      position: 'absolute',
      right: 20,
      bottom: 30,
      display: 'flex',
      alignItems: 'center',
    }}
    >
      <span id='fps'>{fps}</span> FPS
    </Box>
  )
}
/** Round to specific digit eg 0.001461 => 0.0015 */
function roundToDecimal(number, digits) {
  const multiPlayer = 10
  digits = Math.max(1, digits)
  const factor = Math.pow(multiPlayer, digits)
  return Math.round(factor * number) / factor
}
export default FPSDisplayer
