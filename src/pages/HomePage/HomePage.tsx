// import React from 'react'
import { Button, TabBar } from 'antd-mobile'
import Banner from '../HomePage/components/Banner/Banner'
import SearchForm from './components/SearchForm/SearchForm'
import styles from './HomePage.module.css'


function HomePage() {
    return (
        <div className={styles.container}>
            {/* 渲染 Banner */}
            <Banner />
            {/* 渲染搜索表单 */}
            <SearchForm />
            {/* 其他内容，如推荐酒店、活动等 */}
        </div>
    )
}

export default HomePage
