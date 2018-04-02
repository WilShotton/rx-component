import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import fp from 'lodash/fp'
import React from 'react'
import Rx from 'rxjs/Rx'
import { RxComponent, RxPureComponent } from './index'


Enzyme.configure({ adapter: new Adapter() })

describe('RxComponents', () => {

    describe('<RxComponent />', () => {

        it('should be a function', () => {

            expect(fp.isFunction(RxComponent)).toBe(true)
        })

        it('should extend React.Component', () => {

            expect(RxComponent.prototype).toBeInstanceOf(React.Component)
        })
    })

    describe('<RxPureComponent />', () => {

        it('should be a function', () => {

            expect(fp.isFunction(RxPureComponent)).toBe(true)
        })

        it('should extend React.PureComponent', () => {

            expect(RxPureComponent.prototype).toBeInstanceOf(React.PureComponent)
        })
    })

    describe('Disposables', () => {

        let stream$
        let subscription
        let wrapper

        class Component extends RxComponent {

            componentWillMount() {

                subscription = stream$.subscribe(() => {})

                this.addDisposables(
                    subscription
                )
            }

            render() {

                return <div />
            }
        }

        beforeEach(() => {

            stream$ = new Rx.Subject()

            wrapper = mount(<Component />)
        })

        it('should add disposables', () => {

            const __disposables = wrapper.instance().__disposables

            expect(__disposables.length).toBe(1)
            expect(__disposables[0]).toBe(subscription)
            expect(__disposables[0].closed).toBe(false)
        })

        it('should close disposables', () => {

            wrapper.unmount()

            expect(subscription.closed).toBe(true)
        })
    })

    describe('Events', () => {

        let handler

        class Component extends RxComponent {

            constructor(props) {

                super(props)

                this.createHandlers(['click'])
            }

            componentDidMount() {

                this.event('click').subscribe(handler)
            }

            render() {

                const { on } = this

                return <button onClick={on.click}>Click</button>
            }
        }

        let wrapper

        beforeEach(() => {

            handler = jest.fn()

            wrapper = mount(<Component />)
        })

        it('should create event handlers', () => {

            expect(wrapper.instance().on.click).toEqual(expect.any(Function))
        })

        it('should call event handlers', () => {

            expect(handler).not.toHaveBeenCalled()

            wrapper.find('button').simulate('click')

            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should unsubscribe event handlers on unmount', () => {

            const eventSubject = { unsubscribe: jest.fn() }

            wrapper.instance().__eventSubject = eventSubject

            expect(eventSubject.unsubscribe).not.toHaveBeenCalled()

            wrapper.unmount()

            expect(eventSubject.unsubscribe).toHaveBeenCalledTimes(1)
        })
    })

    describe('Props', () => {

        let handler

        class Component extends RxComponent {

            componentDidMount() {

                this.propAsStream('foo').subscribe(handler)
            }

            render() {
                return (
                    <div>Component</div>
                )
            }
        }

        let wrapper

        beforeEach(() => {

            handler = jest.fn()

            wrapper = mount(<Component />)
        })

        it('should add propsSubject observers', () => {

            expect(wrapper.instance().__propsSubject.observers.length).toBe(1)
        })

        it('should start with the initial prop', () => {

            expect(handler).toHaveBeenCalledTimes(1)

            // No prop is set and there is no default
            // @TODO: Only fire when a prop is set
            expect(handler).toHaveBeenCalledWith(undefined)
        })

        it('should observe any prop changes', () => {

            expect(handler).toHaveBeenCalledTimes(1)
            expect(handler).toHaveBeenCalledWith(undefined)

            setTimeout(() => {

                wrapper.setProps({ foo: 'bar' })

                expect(handler).toHaveBeenCalledTimes(2)
                expect(handler).toHaveBeenCalledWith('bar')

            }, 0)
        })

        it('should unsubscribe on unmount', () => {

            const propsSubject = { unsubscribe: jest.fn() }

            wrapper.instance().__propsSubject = propsSubject

            expect(propsSubject.unsubscribe).not.toHaveBeenCalled()

            wrapper.unmount()

            expect(propsSubject.unsubscribe).toHaveBeenCalledTimes(1)
        })
    })
})
