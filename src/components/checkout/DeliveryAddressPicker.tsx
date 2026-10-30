"use client";

import { useEffect, useRef, useState, useId } from "react";
import { MagnifyingGlass, MapPin, Check, Crosshair, X, SpinnerGap, Buildings } from "@phosphor-icons/react";
import "leaflet/dist/leaflet.css";

interface SearchResult {
  id: string | number;
  lat: number;
  lon: number;
  title: string;
  subtitle: string;
  formattedAddress: string;
}

interface DeliveryAddressPickerProps {
  initialAddress?: string;
  onAddressSelect: (fullAddress: string) => void;
}

// Координаты центра Ташкента (сквер Амира Темура)
const DEFAULT_CENTER: [number, number] = [41.3111, 69.2797];

export default function DeliveryAddressPicker({
  initialAddress = "",
  onAddressSelect,
}: DeliveryAddressPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Выбранная точка и адрес
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>(DEFAULT_CENTER);
  const [selectedAddress, setSelectedAddress] = useState(
    initialAddress || "г. Ташкент, сквер Амира Темура"
  );
  const [apartmentDetails, setApartmentDetails] = useState({
    apartment: "",
    entrance: "",
    floor: "",
    comment: "",
  });
  const [isReverseLoading, setIsReverseLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Инициализация карты Leaflet
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;

      // Настройка иконки маркера в стиле Яндекс Доставки
      const customPinIcon = L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: #000; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2.5px solid #fff; transition: transform 0.2s ease;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FEE000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3" fill="#FEE000"></circle>
              </svg>
            </div>
            <div style="position: absolute; bottom: 0; width: 10px; height: 10px; background: #000; transform: rotate(45deg); z-index: -1;"></div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 42],
      });

      if (!mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: selectedCoords,
        zoom: 15,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Стилизованные тайлы OpenStreetMap CartoDB Positron (чистый аккуратный дизайн под доставку)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker(selectedCoords, {
        icon: customPinIcon,
        draggable: true,
      }).addTo(map);

      // Обработка перетаскивания маркера
      marker.on("dragend", async () => {
        const pos = marker.getLatLng();
        setSelectedCoords([pos.lat, pos.lng]);
        setIsConfirmed(false);
        await reverseGeocode(pos.lat, pos.lng);
      });

      // Клик по карте перемещает маркер
      map.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setSelectedCoords([lat, lng]);
        setIsConfirmed(false);
        await reverseGeocode(lat, lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Определение адреса по координатам (обратное геокодирование)
  const reverseGeocode = async (lat: number, lon: number) => {
    setIsReverseLoading(true);
    try {
      const res = await fetch(`/api/geo/reverse?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (data.formattedAddress) {
        setSelectedAddress(data.formattedAddress);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReverseLoading(false);
    }
  };

  // Поиск мест при вводе
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSearch(true);
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingSearch(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Выбор объекта из списка подсказок
  const handleSelectResult = (item: SearchResult) => {
    setSelectedCoords([item.lat, item.lon]);
    setSelectedAddress(item.formattedAddress);
    setShowDropdown(false);
    setQuery("");
    setIsConfirmed(false);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([item.lat, item.lon], 16, { animate: true });
      markerRef.current.setLatLng([item.lat, item.lon]);
    }
  };

  // Геолокация пользователя
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setSelectedCoords([lat, lon]);
        setIsConfirmed(false);
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lon], 16, { animate: true });
          markerRef.current.setLatLng([lat, lon]);
        }
        await reverseGeocode(lat, lon);
      },
      (err) => {
        console.warn("Geolocation denied or error:", err);
      }
    );
  };

  // Подтверждение выбранного адреса
  const handleConfirmAddress = () => {
    const extraParts = [];
    if (apartmentDetails.entrance) extraParts.push(`подъезд ${apartmentDetails.entrance}`);
    if (apartmentDetails.floor) extraParts.push(`эт. ${apartmentDetails.floor}`);
    if (apartmentDetails.apartment) extraParts.push(`кв./офис ${apartmentDetails.apartment}`);
    if (apartmentDetails.comment) extraParts.push(`(${apartmentDetails.comment})`);

    const fullFinalAddress = extraParts.length > 0 
      ? `${selectedAddress}, ${extraParts.join(", ")}`
      : selectedAddress;

    setIsConfirmed(true);
    onAddressSelect(fullFinalAddress);
  };

  return (
    <div className="space-y-4">
      {/* 1. Поисковая строка в стиле Яндекс Доставки */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            {isLoadingSearch ? (
              <SpinnerGap className="w-5 h-5 animate-spin text-[#528A9A]" />
            ) : (
              <MagnifyingGlass className="w-5 h-5" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowDropdown(true);
            }}
            placeholder="Введите место, улицу, ТЦ или ориентир в Ташкенте..."
            className="w-full pl-10 pr-24 py-3 rounded-2xl bg-[#F5F8F8] border border-[#D9E7E8] text-sm focus:outline-none focus:border-[#528A9A] focus:bg-white transition shadow-sm"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setShowDropdown(false);
              }}
              className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCurrentLocation}
              title="Мое местоположение"
              className="absolute right-2 px-2.5 py-1.5 rounded-xl bg-white border border-[#D9E7E8] text-slate-600 text-xs font-medium hover:border-[#528A9A] hover:text-[#375E6A] flex items-center gap-1 transition shadow-xs"
            >
              <Crosshair className="w-3.5 h-3.5 text-[#528A9A]" />
              <span className="hidden sm:inline">Где я</span>
            </button>
          )}
        </div>

        {/* Выпадающие подсказки объектов */}
        {showDropdown && results.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-72 overflow-y-auto">
            <div className="p-2 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Найденные объекты и адреса в Ташкенте
            </div>
            {results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectResult(item)}
                className="w-full text-left px-4 py-3 hover:bg-[#F5F8F8] border-b border-slate-50 last:border-none flex items-start gap-3 transition"
              >
                <div className="w-8 h-8 rounded-full bg-[#EBF2F3] text-[#375E6A] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Контейнер интерактивной карты */}
      <div className="relative rounded-2xl overflow-hidden border border-[#D9E7E8] shadow-sm bg-slate-100">
        <div
          ref={mapContainerRef}
          className="w-full h-[280px] sm:h-[320px] z-10"
        />

        {/* Подсказка перемещения маркера */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Передвигайте метку или кликайте по карте
          </div>
        </div>

        {/* Индикатор загрузки геокодера при сдвиге карты */}
        {isReverseLoading && (
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 px-3 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2 text-xs text-slate-700">
            <SpinnerGap className="w-4 h-4 animate-spin text-[#528A9A]" />
            Определяем точный адрес...
          </div>
        )}
      </div>

      {/* 3. Карточка выбранного адреса и подтверждение (стиль Яндекс) */}
      <div className="p-4 rounded-2xl bg-[#F5F8F8] border border-[#D9E7E8] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#528A9A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Адрес доставки:
              </div>
              <div className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                {selectedAddress}
              </div>
            </div>
          </div>
          {isConfirmed && (
            <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <Check className="w-3.5 h-3.5" />
              Подтверждено
            </span>
          )}
        </div>

        {/* Дополнительные поля: подъезд, этаж, квартира */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 block mb-1">
              Подъезд
            </label>
            <input
              type="text"
              value={apartmentDetails.entrance}
              onChange={(e) => {
                setApartmentDetails({ ...apartmentDetails, entrance: e.target.value });
                setIsConfirmed(false);
              }}
              placeholder="1"
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D9E7E8] text-xs focus:outline-none focus:border-[#528A9A]"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 block mb-1">
              Этаж
            </label>
            <input
              type="text"
              value={apartmentDetails.floor}
              onChange={(e) => {
                setApartmentDetails({ ...apartmentDetails, floor: e.target.value });
                setIsConfirmed(false);
              }}
              placeholder="4"
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D9E7E8] text-xs focus:outline-none focus:border-[#528A9A]"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 block mb-1">
              Кв. / Офис
            </label>
            <input
              type="text"
              value={apartmentDetails.apartment}
              onChange={(e) => {
                setApartmentDetails({ ...apartmentDetails, apartment: e.target.value });
                setIsConfirmed(false);
              }}
              placeholder="45"
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D9E7E8] text-xs focus:outline-none focus:border-[#528A9A]"
            />
          </div>
        </div>

        <div>
          <input
            type="text"
            value={apartmentDetails.comment}
            onChange={(e) => {
              setApartmentDetails({ ...apartmentDetails, comment: e.target.value });
              setIsConfirmed(false);
            }}
            placeholder="Комментарий для курьера (код домофона, шлагбаум...)"
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9E7E8] text-xs focus:outline-none focus:border-[#528A9A]"
          />
        </div>

        {/* Кнопка подтверждения адреса */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleConfirmAddress}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm ${
              isConfirmed
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-[#25252B] text-white hover:bg-black"
            }`}
          >
            {isConfirmed ? (
              <>
                <Check className="w-4 h-4" />
                Адрес подтверждён
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Подтвердить этот адрес для доставки
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
