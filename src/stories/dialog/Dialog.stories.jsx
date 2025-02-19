import React from 'react'
import Dialog, {OpenDialogHeaderContent, OpenDialogBodyContent} from '../../Components/Dialog_redesign'
import debug from '../../utils/debug'


export default {
  title: 'BLDRS UI/Dialogs/Open_Dialog',
  component: Dialog,
}

const Template = (args) => {
  return (
    <Dialog
      headerContent={<OpenDialogHeaderContent/>}
      bodyContent={<OpenDialogBodyContent/>}
      headerText={'Open file'}
      isDialogDisplayed={ true }
      setIsDialogDisplayed={() => debug().log('setIsDialogDisplayed')}
    />
  )
}

export const OpenDialog = Template.bind({})
