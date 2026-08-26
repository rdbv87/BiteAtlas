export type Language = 'es' | 'en'

export interface TranslationSchema {
  common: {
    appName: string
    tagline: string
    loading: string
    error: string
    retry: string
    backToHome: string
    cancel: string
    save: string
    delete: string
    edit: string
    close: string
    all: string
    search: string
    noResults: string
  }
  nav: {
    home: string
    map: string
    contribute: string
    myContributions: string
    profile: string
    curation: string
    login: string
    register: string
    logout: string
  }
  map: {
    title: string
    subtitle: string
    emptyTitle: string
    emptyDescription: string
    contributeRecipe: string
    recipesCount: string
    recipesPublished: string
    exploreTraditions: string
    layerStyles: {
      standard: string
      humanitarian: string
      classic: string
    }
  }
  fichas: {
    recipe: string
    history: string
    festivities: string
    ingredients: string
    preparation: string
    culturalContext: string
    localAdaptations: string
    difficulty: string
    prepTime: string
    portions: string
    origin: string
  }
  aportes: {
    title: string
    subtitle: string
    stepBasic: string
    stepIngredients: string
    stepRecipe: string
    stepCultural: string
    dishName: string
    country: string
    region: string
    story: string
    submit: string
  }
  perfil: {
    title: string
    myProfile: string
    xpPoints: string
    badges: string
    role: string
  }
  landing: {
    heroBadge: string
    heroTitle: string
    heroDefaultSummary: string
    heroEnterMap: string
    heroViewRecipes: string
    heroPublishFirst: string
    heroLoadingFeatured: string
    heroAtlasWaiting: string
    heroAtlasReading: string
    statsCountries: string
    statsRecipes: string
    statsWays: string
    fieldNotesBadge: string
    fieldNotesTitlePlural: string
    fieldNotesTitleEmpty: string
    fieldNotesIntro: string
    fieldNotesCommunity: string
    fieldNotesFirstStory: string
    expeditionBadge: string
    expeditionTitle: string
    expeditionDesc: string
    expeditionExploreCountry: string
    expeditionContribute: string
    expeditionStartingPoint: string
    expeditionYourKitchen: string
    travelAtlasBadge: string
    travelAtlasTitle: string
    travelAtlasDesc: string
    footerTagline: string
    footerShareRecipe: string
  }
}
