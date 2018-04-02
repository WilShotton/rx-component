import isEqual from 'lodash/fp/isEqual'
import React from 'react'
import Rx from 'rxjs/Rx'


const RX_COMPONENT = 'RxComponent'
const RX_PURE_COMPONENT = 'RxPureComponent'

const propAsStreamFilter = stream$ => stream$.distinctUntilChanged(isEqual)

const factory = type => {

    const Component = type === RX_PURE_COMPONENT
        ? React.PureComponent
        : React.Component

    return class extends Component {

        static displayName = type

        componentWillUnmount() {

            this.dispose()

            this.__eventSubject.unsubscribe()
            this.__propsSubject.unsubscribe()
        }


        // Disposables
        // --------------------
        __disposables = []

        addDisposables = (...args) => {

            this.__disposables = [ ...this.__disposables, ...args ]
        }

        dispose = () => {

            for (let i = 0, l = this.__disposables.length; i < l; i++) {

                this.__disposables[i].unsubscribe()
            }
        }

        // Events
        // --------------------
        __eventSubject = new Rx.Subject()

        on = {}

        createHandlers = (keys, payloadMapping = {}) => {

            for (let i = 0, l = keys.length; i < l; i++) {

                const key = keys[i]

                this.on[key] = this.mapEvent(
                    key,
                    payloadMapping ? payloadMapping[key] : null
                )
            }
        }

        event = eventName => {

            return this.__eventSubject
                .filter(({name}) => name === eventName)
                .pluck('event')
        }

        mapEvent = (name, payload) => sourceEvent => {

            const event = payload
                ? { ...sourceEvent, payload }
                : sourceEvent

            this.__eventSubject.next({ event, name })
        }


        // Props
        // --------------------
        __propsSubject = new Rx.Subject()

        props$ = this.__propsSubject.startWith(this.props)

        propAsStream = (key, filter = propAsStreamFilter) => {

            return this.props$
                .pluck(key)
                .startWith(this.props[key])
                .let(filter)
                .publishReplay(1)
                .refCount()
        }

        // State
        // --------------------
        stateObserver = {

            complete: () => {

                throw new Error(`${this.constructor.displayName}. Your stateObserver completed`)
            },

            error: error => {

                console.warn(this.constructor.displayName, error)
            },

            next: state => {

                this.setState(state)
            }
        }
    }
}

export const RxComponent = factory(RX_COMPONENT)

export const RxPureComponent = factory(RX_PURE_COMPONENT)
