import React, {useEffect, useState, useContext} from 'react'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/styles/useTheme'
import {ColorModeContext} from '../Context/ColorMode'
import CaretIcon from '../assets/2D_Icons/Caret.svg'
import {dayColor, nightColor} from '../utils/constants'


/**
 * Expansion panels are used to package property sets
 *
 * @property {string} summary content of the panel
 * @property {string} detail title of the panel
 * @property {boolean} expandState global control of the panel
 * @return {React.ReactElement}
 */
export default function ExpansionPanel({summary, detail, expandState}) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(expandState)
  const colorTheme = useContext(ColorModeContext)


  useEffect(() => {
    setExpanded(expandState)
  }, [expandState])


  return (
    <Accordion
      elevation={0}
      sx={{
        'backgroundColor': colorTheme.isDay() ? dayColor : nightColor,
        '& .MuiAccordionSummary-root': {
          width: '100%',
          padding: 0,
          borderBottom: `.5px solid ${theme.palette.highlight.heavier}`,
        },
        '& .MuiAccordionSummary-root.Mui-expanded': {
          marginBottom: '0.5em',
        },
        '& .MuiAccordionDetails-root': {
          padding: 0,
        },
        '& svg': {
          width: '14px',
          height: '14px',
          fill: theme.palette.primary.contrastText,
          marginRight: '12px',
          marginLeft: '12px',
        },
      }}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        expandIcon={<CaretIcon/>}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{
          'maxWidth': '320px',
          'whiteSpace': 'nowrap',
          'overflow': 'hidden',
          'textOverflow': 'ellipsis',
          '@media (max-width: 900px)': {
            maxWidth: '320px',
          },
        }} variant='h3'
        >
          <Box>{summary}</Box>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {detail}
      </AccordionDetails>
    </Accordion>
  )
}
