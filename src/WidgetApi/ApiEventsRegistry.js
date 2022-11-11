import useStore from '../store/useStore'


const EVENT_VIEWER_LOAD_MODEL = 'ai.bldrs-share.LoadModel'
const EVENT_VIEWER_SELECT_ELEMENTS = 'ai.bldrs-share.SelectElements'
const EVENT_CLIENT_SELECT_ELEMENTS = 'ai.bldrs-share.ElementsSelected'
const EVENT_CLIENT_DESELECT_ELEMENTS = 'ai.bldrs-share.ElementsDeSelected'

/**
 * Api Events are defined here
 */
class ApiEventsRegistry {
  apiConnection = null
  navigation = null

  /**
   * constructor
   */
  constructor(apiConnection, navigation) {
    this.apiConnection = apiConnection
    this.navigation = navigation
    this.registerEventHandlers()
    this.registerEventDispatchers()
    apiConnection.start()
  }

  EVENT_HANDLER_LOAD_MODEL = (data) => {
    if (!('githubIfcPath' in data)) {
      return this.apiConnection.missingArgumentResponse('githubIfcPath')
    }
    this.navigation(`/share/v/gh/${ data.githubIfcPath}`)
    return this.apiConnection.successfulResponse({})
  }

  EVENT_HANDLER_SELECT_ELEMENTS = (data) => {
    if (!('githubIfcPath' in data)) {
      return this.apiConnection.missingArgumentResponse('githubIfcPath')
    }
    if (!('globalIds' in data)) {
      return this.apiConnection.missingArgumentResponse('globalIds')
    }
    if (data.globalIds.length) {
      this.navigation(`/share/v/gh/${ data.githubIfcPath }?q=${ data.globalIds[0]}`)
    } else {
      this.navigation( `/share/v/gh/${ data.githubIfcPath}`)
    }

    return this.apiConnection.successfulResponse({})
  }

  EVENT_HANDLER_MAP = {
    [EVENT_VIEWER_LOAD_MODEL]: this.EVENT_HANDLER_LOAD_MODEL,
    [EVENT_VIEWER_SELECT_ELEMENTS]: this.EVENT_HANDLER_SELECT_ELEMENTS,
  }

  /**
   * get ids of selected elements.
   *
   * @param {object} state
   * @return {string[]} array of GlobalIds.
   */
  getSelectedElementIds(state) {
    return [state.selectedElement.GlobalId.value]
  }

  /**
   * check if state has changed.
   *
   * @param {object} state
   * @param {string[]} lastSelectedElementIds
   * @return {boolean}
   */
  selectedElementIdsHasChanged(state, lastSelectedElementIds) {
    if (state.selectedElement && Object.prototype.hasOwnProperty.call(state.selectedElement, 'GlobalId')) {
      return JSON.stringify(lastSelectedElementIds) !== JSON.stringify(this.getSelectedElementIds(state))
    }
  }

  EVENT_DISPATCHER_ELEMENT_SELECTION = () => {
    let lastSelectedElementIds = []
    useStore.subscribe((state) => {
      if (this.selectedElementIdsHasChanged(state, lastSelectedElementIds)) {
        const newSelectedElementIds = this.getSelectedElementIds(state)
        if (newSelectedElementIds.length > 0) {
          this.apiConnection.send(EVENT_CLIENT_SELECT_ELEMENTS, newSelectedElementIds)
        }
        lastSelectedElementIds = newSelectedElementIds
      }
    })
  }

  EVENT_DISPATCHER_ELEMENT_DESELECTION = () => {
    let lastSelectedElementIds = []
    useStore.subscribe((state) => {
      if (this.selectedElementIdsHasChanged(state, lastSelectedElementIds)) {
        const newSelectedElementIds = this.getSelectedElementIds(state)
        const deSelectedElementIds = lastSelectedElementIds.filter((x) => !newSelectedElementIds.includes(x))
        if (deSelectedElementIds && deSelectedElementIds.length > 0) {
          this.apiConnection.send(EVENT_CLIENT_DESELECT_ELEMENTS, deSelectedElementIds)
        }
        lastSelectedElementIds = newSelectedElementIds
      }
    })
  }

  EVENT_DISPATCHER_MAP = {
    [EVENT_CLIENT_SELECT_ELEMENTS]: this.EVENT_DISPATCHER_ELEMENT_SELECTION,
    [EVENT_CLIENT_DESELECT_ELEMENTS]: this.EVENT_DISPATCHER_ELEMENT_DESELECTION,
  }

  registerEventHandlers = () => {
    for (const [eventName, eventHandler] of Object.entries(this.EVENT_HANDLER_MAP)) {
      this.apiConnection.on(`action:${ eventName}`, eventHandler)
    }
  }

  registerEventDispatchers = () => {
    this.apiConnection.requestCapabilities(Object.keys(this.EVENT_DISPATCHER_MAP))
    for (const eventDispatcher of Object.values(this.EVENT_DISPATCHER_MAP)) {
      eventDispatcher()
    }
  }
}

export default ApiEventsRegistry
