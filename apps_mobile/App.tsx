import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from "react-native";

interface Product {
  id: string;
  name: string;
  brand: string;
  priceUzs: number;
  oldPriceUzs?: number;
  image: string;
  rating: number;
}

const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Apple iPhone 16 Pro Max 256GB Natural Titanium",
    brand: "Apple",
    priceUzs: 16950000,
    oldPriceUzs: 18200000,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
  },
  {
    id: "prod-2",
    name: "Samsung Galaxy S24 Ultra 512GB Titanium Gray",
    brand: "Samsung",
    priceUzs: 15400000,
    oldPriceUzs: 16800000,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
  },
  {
    id: "prod-3",
    name: "MacBook Pro 16\" M3 Max Space Black",
    brand: "Apple",
    priceUzs: 38900000,
    oldPriceUzs: 41500000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80",
    rating: 5.0,
  },
  {
    id: "prod-6",
    name: "Apple AirPods Pro 2 MagSafe USB-C",
    brand: "Apple",
    priceUzs: 3100000,
    oldPriceUzs: 3450000,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
  },
];

function formatPrice(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " сум";
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "catalog" | "cart" | "profile">("home");
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      if (exist) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: product.id, qty: 1 }];
    });
    Alert.alert("Корзина", `"${product.name}" добавлен в корзину!`);
  };

  const toggleFav = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top App Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoLetter}>A</Text>
          </View>
          <View>
            <Text style={styles.logoTitle}>APEX TECH</Text>
            <Text style={styles.logoSubtitle}>Tashkent Store (Expo Go)</Text>
          </View>
        </View>

        <View style={styles.headerBadges}>
          <TouchableOpacity style={styles.badgeBtn} onPress={() => setActiveTab("cart")}>
            <Text style={styles.badgeText}>🛒 {cartCount}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Поиск оригинальной техники..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Main Body */}
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {activeTab === "home" && (
          <>
            {/* Bento Promo Banner */}
            <View style={styles.bentoBanner}>
              <Text style={styles.bentoTag}>⚡ ХИТ В ТАШКЕНТЕ 2026</Text>
              <Text style={styles.bentoTitle}>iPhone 16 Pro Max</Text>
              <Text style={styles.bentoDesc}>
                Титановый корпус, чип A18 Pro и доставка по городу за 2 часа.
              </Text>
              <TouchableOpacity
                style={styles.bentoBtn}
                onPress={() => addToCart(PRODUCTS[0])}
              >
                <Text style={styles.bentoBtnText}>Купить за {formatPrice(PRODUCTS[0].priceUzs)}</Text>
              </TouchableOpacity>
            </View>

            {/* Catalog Grid */}
            <Text style={styles.sectionTitle}>Популярные устройства</Text>
            <View style={styles.grid}>
              {PRODUCTS.filter(
                (p) =>
                  !search ||
                  p.name.toLowerCase().includes(search.toLowerCase()) ||
                  p.brand.toLowerCase().includes(search.toLowerCase())
              ).map((product) => {
                const isFav = favorites.includes(product.id);
                return (
                  <View key={product.id} style={styles.card}>
                    <TouchableOpacity
                      style={styles.favBtn}
                      onPress={() => toggleFav(product.id)}
                    >
                      <Text style={styles.favBtnText}>{isFav ? "❤️" : "🤍"}</Text>
                    </TouchableOpacity>

                    <Image source={{ uri: product.image }} style={styles.cardImg} resizeMode="contain" />

                    <Text style={styles.cardBrand}>{product.brand}</Text>
                    <Text style={styles.cardName} numberOfLines={2}>
                      {product.name}
                    </Text>

                    <View style={styles.priceRow}>
                      <Text style={styles.cardPrice}>{formatPrice(product.priceUzs)}</Text>
                      {product.oldPriceUzs && (
                        <Text style={styles.cardOldPrice}>{formatPrice(product.oldPriceUzs)}</Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.buyBtn}
                      onPress={() => addToCart(product)}
                    >
                      <Text style={styles.buyBtnText}>В корзину</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {activeTab === "cart" && (
          <View style={styles.emptyCartBox}>
            <Text style={styles.cartHeader}>Корзина покупок</Text>
            {cart.length === 0 ? (
              <Text style={styles.emptyText}>Ваша корзина пуста</Text>
            ) : (
              <View>
                {cart.map((item) => {
                  const p = PRODUCTS.find((pr) => pr.id === item.id);
                  if (!p) return null;
                  return (
                    <View key={item.id} style={styles.cartItem}>
                      <Text style={styles.cartItemTitle}>{p.name}</Text>
                      <Text style={styles.cartItemPrice}>
                        {item.qty} шт. × {formatPrice(p.priceUzs)}
                      </Text>
                    </View>
                  );
                })}
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => Alert.alert("Заказ оформлен", "Спасибо! Наш менеджер свяжется с вами.")}
                >
                  <Text style={styles.checkoutBtnText}>Оформить заказ в Ташкенте</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {activeTab === "profile" && (
          <View style={styles.emptyCartBox}>
            <Text style={styles.cartHeader}>Личный кабинет</Text>
            <Text style={styles.emptyText}>Синхронизировано с базой данных Neon.</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("home")}
        >
          <Text style={[styles.navText, activeTab === "home" && styles.navTextActive]}>
            🏠 Главная
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("cart")}
        >
          <Text style={[styles.navText, activeTab === "cart" && styles.navTextActive]}>
            🛒 Корзина ({cartCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("profile")}
        >
          <Text style={[styles.navText, activeTab === "profile" && styles.navTextActive]}>
            👤 Профиль
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
  },
  logoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  logoSubtitle: {
    fontSize: 10,
    color: "#64748b",
  },
  headerBadges: {
    flexDirection: "row",
    gap: 8,
  },
  badgeBtn: {
    backgroundColor: "#eef2ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "#4f46e5",
    fontWeight: "bold",
    fontSize: 12,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  searchInput: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0f172a",
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 80,
  },
  bentoBanner: {
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  bentoTag: {
    color: "#a5b4fc",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
  },
  bentoTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  bentoDesc: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  bentoBtn: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  bentoBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
    position: "relative",
  },
  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  favBtnText: {
    fontSize: 16,
  },
  cardImg: {
    width: "100%",
    height: 120,
    marginBottom: 8,
  },
  cardBrand: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  cardName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginVertical: 4,
    height: 32,
  },
  priceRow: {
    marginVertical: 4,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0f172a",
  },
  cardOldPrice: {
    fontSize: 10,
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  buyBtn: {
    backgroundColor: "#4f46e5",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  buyBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },
  emptyCartBox: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cartHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
  },
  cartItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  cartItemTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0f172a",
  },
  cartItemPrice: {
    fontSize: 12,
    color: "#4f46e5",
    marginTop: 2,
  },
  checkoutBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  navTextActive: {
    color: "#4f46e5",
    fontWeight: "bold",
  },
});
