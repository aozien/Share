import React, {useState} from 'react'
import {render, renderHook, act, fireEvent, screen, waitFor} from '@testing-library/react'
import {IfcViewerAPIExtended} from '../Infrastructure/IfcViewerAPIExtended'
import useStore from '../store/useStore'
import ShareMock from '../ShareMock'
import {actAsyncFlush} from '../utils/tests'
import {makeTestTree} from '../utils/TreeUtils.test'
import CadView from './CadView'
import * as AllCadView from './CadView'
import * as reactRouting from 'react-router-dom'


const mockedUseNavigate = jest.fn()
const defaultLocationValue = {pathname: '/index.ifc', search: '', hash: '', state: null, key: 'default'}
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
    useLocation: jest.fn(() => defaultLocationValue),
  }
})

describe('CadView', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders with mock IfcViewerAPI', async () => {
    const modelPath = {
      filepath: `index.ifc`,
    }
    const viewer = new IfcViewerAPIExtended()
    viewer._loadedModel.ifcManager.getSpatialStructure.mockReturnValueOnce(makeTestTree())
    const {result} = renderHook(() => useState(modelPath))
    render(
        <ShareMock>
          <CadView
            installPrefix={''}
            appPrefix={''}
            pathPrefix={''}
            modelPath={result.current[0]}
          />
        </ShareMock>,
    )
    // Necessary to wait for some of the component to render to avoid
    // act() warnings from testing-library.
    await waitFor(() => screen.getByTitle(/Bldrs: 1.0.0/i))
    await actAsyncFlush()
  })

  it('renders and selects the element ID from URL', async () => {
    const testTree = makeTestTree()
    const targetEltId = testTree.children[0].expressID
    const mockCurrLocation = {...defaultLocationValue, pathname: '/index.ifc/1'}
    reactRouting.useLocation.mockReturnValue(mockCurrLocation)

    const modelPath = {
      filepath: `index.ifc`,
      gitpath: undefined,
    }
    const viewer = new IfcViewerAPIExtended()
    viewer._loadedModel.ifcManager.getSpatialStructure.mockReturnValueOnce(testTree)
    const {result} = renderHook(() => useState(modelPath))
    render(
        <ShareMock>
          <CadView
            installPrefix={'/'}
            appPrefix={'/'}
            pathPrefix={'/'}
            modelPath={result.current[0]}
          />
        </ShareMock>)
    await waitFor(() => screen.getByTitle(/Bldrs: 1.0.0/i))
    await actAsyncFlush()
    const getPropsCalls = viewer.getProperties.mock.calls
    const numCallsExpected = 2 // First for root, second from URL path
    expect(mockedUseNavigate).not.toHaveBeenCalled() // Make sure no redirection happened
    expect(getPropsCalls.length).toBe(numCallsExpected)
    expect(getPropsCalls[0][0]).toBe(0) // call 1, arg 1
    expect(getPropsCalls[0][1]).toBe(0) // call 1, arg 2
    expect(getPropsCalls[1][0]).toBe(0) // call 2, arg 1
    expect(getPropsCalls[1][1]).toBe(targetEltId) // call 2, arg 2
    await actAsyncFlush()
  })

  it('sets up camera and cutting plan from URL,', async () => {
    const testTree = makeTestTree()
    const mockCurrLocation = {...defaultLocationValue, hash: '#c:1,2,3,4,5,6::p:x=0'}
    reactRouting.useLocation.mockReturnValue(mockCurrLocation)
    const modelPath = {
      filepath: `index.ifc`,
      gitpath: undefined,
    }
    const viewer = new IfcViewerAPIExtended()
    viewer._loadedModel.ifcManager.getSpatialStructure.mockReturnValueOnce(testTree)
    render(
        <ShareMock>
          <CadView
            installPrefix={'/'}
            appPrefix={'/'}
            pathPrefix={'/'}
            modelPath={modelPath}
          />
        </ShareMock>)
    await actAsyncFlush()
    const setCameraPosMock = viewer.IFC.context.ifcCamera.cameraControls.setPosition
    // eslint-disable-next-line no-magic-numbers
    expect(setCameraPosMock).toHaveBeenLastCalledWith(1, 2, 3, true)
    const setCameraTargetMock = viewer.IFC.context.ifcCamera.cameraControls.setTarget
    // eslint-disable-next-line no-magic-numbers
    expect(setCameraTargetMock).toHaveBeenLastCalledWith(4, 5, 6, true)
    const createPlanMock = viewer.clipper.createFromNormalAndCoplanarPoint
    expect(createPlanMock).toHaveBeenCalled()
    await actAsyncFlush()
  })

  it('clear elements and planes on unselect', async () => {
    const testTree = makeTestTree()
    const targetEltId = testTree.children[0].expressID
    const modelPath = {
      filepath: `index.ifc`,
      gitpath: undefined,
    }
    const viewer = new IfcViewerAPIExtended()
    viewer._loadedModel.ifcManager.getSpatialStructure.mockReturnValueOnce(testTree)
    const {result} = renderHook(() => useStore((state) => state))
    await act(() => {
      result.current.setSelectedElement(targetEltId)
      result.current.setSelectedElements([targetEltId])
      result.current.setCutPlaneDirections(['y'])
    })
    const {getByTitle} = render(
        <ShareMock>
          <CadView
            installPrefix={'/'}
            appPrefix={'/'}
            pathPrefix={'/'}
            modelPath={modelPath}
          />
        </ShareMock>)
    expect(getByTitle('Section')).toBeInTheDocument()
    const clearSelection = getByTitle('Clear')
    await act(async () => {
      await fireEvent.click(clearSelection)
    })
    const callDeletePlanes = viewer.clipper.deleteAllPlanes.mock.calls
    expect(callDeletePlanes.length).toBe(1)
    expect(result.current.selectedElements).toHaveLength(0)
    expect(result.current.selectedElement).toBe(null)
    expect(result.current.cutPlanes.length).toBe(0)
    await actAsyncFlush()
  })

  it('prevent reloading without user approval when loading a model from local', async () => {
    window.addEventListener = jest.fn()
    jest.spyOn(AllCadView, 'getNewModelRealPath').mockReturnValue('haus.ifc')
    const mockCurrLocation = {...defaultLocationValue, pathname: '/haus.ifc'}
    reactRouting.useLocation.mockReturnValue(mockCurrLocation)
    const modelPath = {
      filepath: `haus.ifc`,
    }
    const viewer = new IfcViewerAPIExtended()
    viewer._loadedModel.ifcManager.getSpatialStructure.mockReturnValueOnce(makeTestTree())
    render(
        <ShareMock>
          <CadView
            installPrefix=''
            appPrefix=''
            pathPrefix='/v/new'
            modelPath={modelPath}
          />
        </ShareMock>,
    )
    await waitFor(() => screen.getByTitle(/Bldrs: 1.0.0/i))
    await actAsyncFlush()
    viewer._loadedModel.ifcManager.getSpatialStructure.mockReturnValueOnce(makeTestTree())
    render(
        <ShareMock>
          <CadView
            installPrefix=''
            appPrefix=''
            pathPrefix=''
            modelPath={modelPath}
          />
        </ShareMock>,
    )
    expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.anything())
    await actAsyncFlush()
  })

  it('select multiple elements and then clears selection, then reselect', async () => {
    const testTree = makeTestTree()
    const selectedIds = [0, 1]
    const selectedIdsAsString = ['0', '1']
    const modelPath = {
      filepath: `index.ifc`,
      gitpath: undefined,
    }
    const viewer = new IfcViewerAPIExtended()
    viewer._loadedModel.ifcManager.getSpatialStructure.mockReturnValueOnce(testTree)
    const {result} = renderHook(() => useStore((state) => state))
    await act(() => {
      result.current.setSelectedElements(selectedIdsAsString)
    })
    const {getByTitle} = render(
        <ShareMock>
          <CadView
            installPrefix={'/'}
            appPrefix={'/'}
            pathPrefix={'/'}
            modelPath={modelPath}
          />
        </ShareMock>)
    expect(getByTitle('Section')).toBeInTheDocument()
    const clearSelection = getByTitle('Clear')
    await act(async () => {
      await fireEvent.click(clearSelection)
    })
    await act(() => {
      result.current.setSelectedElements(selectedIdsAsString)
    })
    await act(async () => {
      await fireEvent.click(clearSelection)
    })
    expect(result.current.selectedElement).toBe(null)
    expect(result.current.selectedElements).toHaveLength(0)
    await act(() => {
      result.current.setSelectedElements(selectedIdsAsString)
    })
    await act(async () => {
      await fireEvent.click(clearSelection)
    })
    expect(result.current.selectedElement).toBe(null)
    expect(result.current.selectedElements).toHaveLength(0)
    const modelId = 0
    const clearCallParam = [modelId, []] // Clear Selection Call Parameters
    const selectCallParam = [modelId, selectedIds] // Create Selection Call Parameters
    /** Expected basic 2 on load (init search, Select from Url), select, clear, select, clear */
    const expectedCall = [selectCallParam, clearCallParam, clearCallParam, selectCallParam, clearCallParam, selectCallParam, clearCallParam]
    const setSelectionCalls = viewer.setSelection.mock.calls
    expect(setSelectionCalls).toEqual(expectedCall)
  })
})
