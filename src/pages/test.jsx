// component that show all the redux state

import React from 'react'

import { useSelector } from 'react-redux'

export function ReduxState() {
    
        const state = useSelector(state => state)
    
        return (
    
            <div>
    
                <pre>
    
                    {JSON.stringify(state, null, 2)}
    
                </pre>
    
            </div>
    
        )
    
    }

