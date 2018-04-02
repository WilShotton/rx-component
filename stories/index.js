import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Harness from '../src/harness/harness'


storiesOf('GridScroller', module).add('Basic', () => <Harness msg="story" />)
