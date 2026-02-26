import { useEffect, useRef, useState } from 'react'
import {  SearchBar, List, SpinLoading } from 'antd-mobile'
import styles from './LocationPick.module.css'


interface LocationPickerProps {
  onConfirm: (location: { lat: number; lng: number; address?: string }) => void
  onCancel: () => void
}

const AMAP_KEY = 'cc39e8cb04129529c85b6b10fb6dea97'
const AMAP_VERSION = '2.0'

function loadAMapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).AMap) {
      resolve()
      return
    }
    ;(window as any)._AMapSecurityConfig = {
      securityJsCode: '',
    }
    const script = document.createElement('script')
    // script.src = `https://webapi.amap.com/maps?v=${AMAP_VERSION}&key=${AMAP_KEY}&plugin=AMap.Geocoder,AMap.Geolocation,AMap.PlaceSearch`
    // 在 loadAMapScript 的 URL 中加上 AMap.Marker 插件（虽然理论上默认包含，但保险起见）
script.src = `https://webapi.amap.com/maps?v=${AMAP_VERSION}&key=${AMAP_KEY}&plugin=AMap.Geocoder,AMap.Geolocation,AMap.PlaceSearch,AMap.Marker`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('高德地图加载失败'))
    document.head.appendChild(script)
  })
}

export default function LocationPicker({ onConfirm, onCancel }: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const geocoderRef = useRef<any>(null)
  const placeSearchRef = useRef<any>(null)
  const selectedRef = useRef<{ lat: number; lng: number } | null>(null)
  const addressRef = useRef('')

  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [address, setAddress] = useState('')
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null)
  const [searchText, setSearchText] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    let destroyed = false
    let map: any = null

    function reverseGeocode(lng: number, lat: number) {
      if (!geocoderRef.current) return
      geocoderRef.current.getAddress([lng, lat], (status: string, result: any) => {
        if (destroyed) return
        if (status === 'complete' && result.regeocode) {
          const addr = result.regeocode.formattedAddress
          addressRef.current = addr
          setAddress(addr)
        }
      })
    }

    // function updateMarker(lng: number, lat: number) {
    //   if (!map || destroyed) return
    //   selectedRef.current = { lat, lng }
    //   setSelected({ lat, lng })
    //   reverseGeocode(lng, lat)

    //   const AMap = (window as any).AMap
    //   if (markerRef.current) {
    //     markerRef.current.setPosition([lng, lat])
    //   } else {
    //     markerRef.current = new AMap.Marker({
    //       position: [lng, lat],
    //       map,
    //       anchor: 'bottom-center',
    //     })
    //   }
    //   map.setCenter([lng, lat])
    // }
function updateMarker(lng: number, lat: number) {
    if (!map || destroyed) return
    const AMap = (window as any).AMap

    selectedRef.current = { lat, lng }
    setSelected({ lat, lng })
    reverseGeocode(lng, lat)

    const pos = new AMap.LngLat(lng, lat)

    if (markerRef.current) {
      markerRef.current.setPosition(pos)
    } else {
      markerRef.current = new AMap.Marker({
        position: pos,
      })
      map.add(markerRef.current)
    }
    map.setCenter(pos)
  }
    loadAMapScript()
      .then(() => {
        if (destroyed || !mapContainerRef.current) return
        const AMap = (window as any).AMap

        map = new AMap.Map(mapContainerRef.current, {
          zoom: 14,
          center: [121.473701, 31.230393],
          resizeEnable: true,
        })
        mapInstanceRef.current = map

        geocoderRef.current = new AMap.Geocoder({ radius: 1000 })
        placeSearchRef.current = new AMap.PlaceSearch({ pageSize: 10 })

        map.on('click', (e: any) => {
          const { lng, lat } = e.lnglat
          updateMarker(lng, lat)
        })

        setReady(true)

        // 自动定位
        setLocating(true)
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          showMarker: false,
          showCircle: false,
        })
        map.addControl(geolocation)
        geolocation.getCurrentPosition((status: string, result: any) => {
          if (destroyed) return
          setLocating(false)
          if (status === 'complete' && result.position) {
            const { lng, lat } = result.position
            updateMarker(lng, lat)
          }
        })
      })
      .catch(() => {
        if (!destroyed) setLoadError(true)
      })

    return () => {
      destroyed = true
      try {
        map?.destroy()
      } catch (e) {
        // ignore
      }
      mapInstanceRef.current = null
      markerRef.current = null
    }
  }, []) // 空依赖，只执行一次

  const handleSearch = (val: string) => {
    setSearchText(val)
    if (!val.trim() || !placeSearchRef.current) {
      setSuggestions([])
      return
    }
    placeSearchRef.current.search(val, (status: string, result: any) => {
      if (status === 'complete' && result.poiList) {
        setSuggestions(result.poiList.pois.slice(0, 8))
      } else {
        setSuggestions([])
      }
    })
  }

const handleSelectPoi = (poi: any) => {
  const { lng, lat } = poi.location
  const map = mapInstanceRef.current
  const AMap = (window as any).AMap
  if (!map || !AMap) return

  const pos = new AMap.LngLat(lng, lat)
  selectedRef.current = { lat, lng }
  setSelected({ lat, lng })

  const addr = poi.name + (poi.address ? ` (${poi.address})` : '')
  addressRef.current = addr
  setAddress(addr)

  if (markerRef.current) {
    markerRef.current.setPosition(pos)
  } else {
    markerRef.current = new AMap.Marker({ position: pos })
    map.add(markerRef.current)
  }
  map.setCenter(pos)

  setSuggestions([])
  setSearchText('')
}

  return (
    <div className={styles.container}>
      {/* 搜索栏 */}
      <div className={styles.searchBar}>
        <SearchBar
          placeholder="搜索地点"
          value={searchText}
          onChange={handleSearch}
          onClear={() => setSuggestions([])}
        />
        {suggestions.length > 0 && (
          <List className={styles.suggestions}>
            {suggestions.map((poi: any, i: number) => (
              <List.Item
                key={poi.id || i}
                description={poi.address}
                onClick={() => handleSelectPoi(poi)}
              >
                {poi.name}
              </List.Item>
            ))}
          </List>
        )}
      </div>

      {/* 地图容器 */}
      <div className={styles.mapWrapper}>
        <div ref={mapContainerRef} className={styles.mapContainer} />
        {!ready && !loadError && (
          <div className={styles.overlay}>
            <SpinLoading color="#d4a843" />
          </div>
        )}
        {loadError && (
          <div className={styles.overlay}>
            <span className={styles.errorText}>地图加载失败，请检查网络后刷新</span>
          </div>
        )}
      </div>

      {/* 底部 */}
      <div className={styles.bottom}>
        {locating && <div className={styles.locating}>正在定位...</div>}
        {address && <div className={styles.address}>📍 {address}</div>}
        <div className={styles.btnGroup}>
          <button
            className={styles.confirmBtn}
            disabled={!selected}
            onClick={() => {
              if (selectedRef.current) {
                onConfirm({ ...selectedRef.current, address: addressRef.current })
              }
            }}
          >
            确认选点
          </button>
          <button className={styles.cancelBtn} onClick={onCancel}>
            取消
          </button>
        </div>
      </div>
    </div>
  )
}