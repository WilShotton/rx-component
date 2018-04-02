import React from 'react'
import { RxComponent } from '../index'


export default class extends RxComponent {

    static displayName = 'RxComponentHarness'

    static defaultProps = {
        msg: 'Default'
    }

    state = {
        clickCount: 0,
        msg: this.props.msg
    }

    constructor(props) {

        super(props)

        this.createHandlers(['click'])
    }

    componentDidMount() {

        const clickCount$ = this.event('click')
            .map(() => {

                return {
                    clickCount: this.state.clickCount + 1
                }
            })

        const msg$ = this.propAsStream('msg')
            .map(msg => {

                return {
                    msg: `state(${msg})`
                }
            })

        this.addDisposables(
            clickCount$.subscribe(this.stateObserver),
            msg$.subscribe(this.stateObserver)
        )
    }

    render() {

        const { on, props, state } = this

        return (
            <div>
                <h1>RxComponent</h1>
                <div>
                    <button onClick={on.click}>Click</button>
                    <div>{`Click count ${state.clickCount}`}</div>
                </div>
                <div>
                    <div>{`props.msg: ${props.msg}`}</div>
                    <div>{`state.msg: ${state.msg}`}</div>
                </div>
            </div>
        )
    }
}
