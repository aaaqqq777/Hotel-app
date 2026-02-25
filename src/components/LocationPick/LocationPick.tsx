import { useEffect, useRef } from 'react'
import { Button } from 'antd-mobile'

interface LocationPickerProps {
  onConfirm: (location: { lat: number; lng: number }) => void
  onCancel: () => void
}

export default function LocationPicker({ onConfirm, onCancel }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<any>(null)
  const selectedRef = useRef<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // @ts-ignore
    const map = new AMap.Map(mapRef.current, {
      zoom: 14,
      center: [121.473701, 31.230393], // 默认上海
    })

    map.on('click', (e: any) => {
      const { lng, lat } = e.lnglat
      selectedRef.current = { lng, lat }

      if (markerRef.current) {
        markerRef.current.setPosition([lng, lat])
      } else {
        // @ts-ignore
        markerRef.current = new AMap.Marker({
          position: [lng, lat],
          map,
        })
      }
    })

    return () => {
      map.destroy()
    }
  }, [])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div ref={mapRef} style={{ flex: 1 }} />

      <Button
        color="primary"
        onClick={() => {
          if (selectedRef.current) {
            onConfirm(selectedRef.current)
          }
        }}
      >
        确认选点
      </Button>

      <Button onClick={onCancel}>取消</Button>
    </div>
  )
}