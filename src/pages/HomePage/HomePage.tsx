// import React from 'react'
import React from 'react'
import Banner from '../HomePage/components/Banner/Banner'
// import SearchForm from './components/SearchForm/SearchForm'
import styles from './HomePage.module.css'


function HomePage() {
    return (
        <div className={styles.container}>
            {/* 渲染 Banner */}
            <Banner />

            {/* 渲染搜索表单 */}
            {/* <SearchForm /> */}
        </div>
    )
}

export default HomePage
