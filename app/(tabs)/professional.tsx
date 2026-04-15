import { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from 'react-native-reanimated';
import AnimatedBottomSheet from "../components/AnimatedBottomSheet";
import { Styles } from "./styles/professionalsCss";
import colors from "../theme/colors";
import { professionalService } from "../services/database";

const { width, height } = Dimensions.get("window");

interface Professional {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  price: string;
  available: boolean;
  avatar_url?: string;
}

interface FilterType {
  id: string;
  label: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfessionalScreen() {
  const insets = useSafeAreaInsets();
  const HANDLE_HEIGHT = 32;
  const BOTTOM_BAR_OFFSET = Math.max(insets.bottom, 64);
  const COLLAPSED_HEIGHT = Math.round(height * 0.5);
  const EXPANDED_HEIGHT = Math.round(height * 0.8);

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const professionalTypes: FilterType[] = [
    { id: "psychologist", label: "Psicólogo" },
    { id: "therapist", label: "Terapeuta" },
    { id: "psychiatrist", label: "Psiquiatra" },
    { id: "nutritionist", label: "Nutricionista" },
  ];

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      const data = await professionalService.getAllProfessionals();
      setProfessionals(data || []);
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((professional) => {
      const matchesSearch =
        professional.name.toLowerCase().includes(searchText.toLowerCase()) ||
        professional.specialty.toLowerCase().includes(searchText.toLowerCase());

      const matchesFilter =
        selectedFilters.length === 0 ||
        selectedFilters.some((filter) =>
          professional.specialty.toLowerCase().includes(filter.toLowerCase())
        );

      return matchesSearch && matchesFilter;
    });
  }, [professionals, searchText, selectedFilters]);

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const renderFilterChip = ({ item }: { item: FilterType }) => (
    <TouchableOpacity
      style={[
        Styles.filterChip,
        selectedFilters.includes(item.id) && Styles.activeFilterChip,
      ]}
      onPress={() => toggleFilter(item.id)}
    >
      <Text
        style={[
          Styles.filterText,
          selectedFilters.includes(item.id) && Styles.activeFilterText,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderProfessionalCard = ({ item }: { item: Professional }) => (
    <View style={Styles.professionalCard}>
      <View style={Styles.professionalHeader}>
        <View style={Styles.professionalAvatar}>
          <Text style={Styles.avatarText}>{getInitials(item.name)}</Text>
        </View>
        <View style={Styles.professionalInfo}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={Styles.professionalName}>{item.name}</Text>
              <View style={Styles.verifiedRow}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={Styles.verifiedText}>Verificado • {item.specialty}</Text>
              </View>
            </View>
            <TouchableOpacity style={Styles.favoriteButton} accessibilityLabel="Favoritar profissional">
              <Ionicons name="heart-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={Styles.metaRow}>
            <View style={Styles.ratingBadge}>
              <Ionicons name="star" size={12} color={colors.warning} />
              <Text style={Styles.ratingTextSmall}>{item.rating}</Text>
            </View>
            <Text style={Styles.experienceText}>• {item.experience}</Text>
            <View style={Styles.priceBadge}>
              <Text style={Styles.priceBadgeText}>{item.price}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Card footer: perfil + agendar */}
      <View style={Styles.cardFooter}>
        <TouchableOpacity
          style={Styles.profileButton}
          accessibilityLabel="Ver perfil"
          onPress={() => {}}
        >
          <Ionicons name="person-outline" size={16} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={Styles.profileButtonText}>Ver Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[Styles.scheduleButtonWrapper, !item.available && { opacity: 0.6 }]}
          activeOpacity={item.available ? 0.85 : 1}
          disabled={!item.available}
          accessibilityLabel={item.available ? "Agendar consulta" : "Indisponível"}
          onPress={() => {}}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryLight, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={Styles.scheduleButton}
          >
            <Ionicons name="calendar" size={16} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={Styles.scheduleButtonText}>{item.available ? "Agendar" : "Indisponível"}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && professionals.length === 0) {
    return (
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={Styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryLight, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={Styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* header (roxo) permanece no topo DO LAYOUT) */}
      <View style={Styles.headerContainer}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={Styles.imageLogo}
        />
        <Text style={Styles.appTitle}>Encontrar Profissionais</Text>
        <Text style={Styles.subtitle}>Conecte-se com especialistas qualificados</Text>
      </View>

      {/* whiteContainer: container branco arredondado que segura toda a lista */}
      <AnimatedBottomSheet collapsedHeight={COLLAPSED_HEIGHT} expandedHeight={EXPANDED_HEIGHT}>
        <FlatList
          data={filteredProfessionals}
          renderItem={renderProfessionalCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={Styles.professionalsList}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: colors.primary, marginTop: 32 }}>
              Nenhum profissional encontrado.
            </Text>
          }
          // cabeçalho da lista: busca / filtros / títulos (ficam DENTRO do branco)
          ListHeaderComponent={
            <>
              {/* Search Bar */}
              <View style={Styles.searchContainer}>
                <View style={Styles.searchWrapper}>
                  <Ionicons name="search-outline" size={20} color={colors.muted} style={Styles.searchIcon} />
                  <TextInput
                    style={Styles.searchInput}
                    placeholder="Buscar..."
                    placeholderTextColor={colors.muted}
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Buscar profissional"
                    returnKeyType="search"
                  />
                </View>
              </View>

              {/* Filter Chips */}
              <View style={Styles.filtersContainer}>
                <FlatList
                  data={professionalTypes}
                  renderItem={renderFilterChip}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={Styles.filtersList}
                />
              </View>

              {/* Results Header */}
              <View style={Styles.resultsHeader}>
                <Text style={Styles.resultsTitle}>Profissionais Disponíveis ({filteredProfessionals.length})</Text>
              </View>
            </>
          }
          ListFooterComponent={<View style={{ height: BOTTOM_BAR_OFFSET + 24 }} />}
        />
      </AnimatedBottomSheet>
    </LinearGradient>
  );
}