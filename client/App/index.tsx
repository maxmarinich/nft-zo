import React from 'react'

import contractImage from 'contract/contract.png'
import contractDescription from 'contract/index.json'

import zombieImage from 'items/1/1.png'
import zombieDescription from 'items/1/index.json'

import styles from './styles.scss'

type Props = {}

function App(props: Props) {
    return (
        <div className={styles.app}>
            <div className={styles.appHeader}>Demo react app</div>

            <div>
                <img src={contractImage} />
                {JSON.stringify(zombieDescription)}
            </div>

            <div>
                <img src={zombieImage} />
                {JSON.stringify(contractDescription)}
            </div>
        </div>
    )
}

export default App
