# TawjeehExplorer - Système de Licences

## Vue d'ensemble

Ce document décrit le système de licences implémenté dans TawjeehExplorer pour contrôler l'accès aux fonctionnalités de la plateforme.

## Architecture

### Composants principaux

1. **LicenseValidator** (`/src/components/LicenseValidator.tsx`)
   - Composant principal de validation des licences
   - Affiche l'écran de connexion si aucune licence valide n'est trouvée
   - Gère le stockage local des licences

2. **LicenseContext** (`/src/contexts/LicenseContext.tsx`)
   - Context React pour gérer l'état des licences dans toute l'application
   - Fournit des utilitaires pour vérifier les fonctionnalités disponibles

3. **LicenseManagement** (`/src/components/LicenseManagement.tsx`)
   - Interface de gestion des licences pour les utilisateurs
   - Affiche les détails de la licence active et les fonctionnalités disponibles

## Licence de Démonstration

### Clé de démonstration
```
DEMO-TAWJEEH-2025-FREE
```

### Caractéristiques
- **Expiration**: 31 décembre 2025
- **Fonctionnalités incluses**:
  - ✅ Recommandations personnalisées (`student_matcher`)
  - ✅ Base de données complète (`school_database`)
  - ✅ Vue cartographique (`map_view`)
  - ✅ Export de rapports (`export_reports`)

### Utilisation
1. Lancer l'application
2. Entrer un email valide
3. Utiliser la clé: `DEMO-TAWJEEH-2025-FREE`
4. Accéder à toutes les fonctionnalités

## Fonctionnalités protégées

### Export de rapports
- **Localisation**: `StudentMatcher.tsx` - fonction `exportResults`
- **Protection**: Vérification avec `hasFeature('export_reports')`
- **Comportement**: Bouton désactivé si la licence ne permet pas l'export

### Fonctionnalités futures extensibles
Le système est conçu pour supporter facilement de nouvelles restrictions:

```typescript
// Exemple d'ajout de protection
if (!hasFeature('advanced_search')) {
  return <UpgradePrompt feature="advanced_search" />;
}
```

## Structure des licences

### Interface LicenseInfo
```typescript
interface LicenseInfo {
  isValid: boolean;
  licenseKey: string;
  expirationDate: Date | null;
  userEmail: string;
  features: string[];
}
```

### Fonctionnalités disponibles
- `student_matcher` - Algorithme de recommandations
- `school_database` - Accès base de données
- `map_view` - Vue cartographique  
- `export_reports` - Export de rapports
- `advanced_filters` - Filtres avancés
- `api_access` - Accès API (futur)

## Stockage et persistance

### LocalStorage
Les licences sont stockées localement dans le navigateur:
- `tawjeeh_license` - Clé de licence
- `tawjeeh_email` - Email de l'utilisateur

### Validation
- Vérification à chaque démarrage de l'application
- Validation de l'expiration
- Vérification de l'intégrité de la clé

## Extension du système

### Ajout de nouvelles licences

1. **Modifier la validation** dans `LicenseValidator.tsx`:
```typescript
const validateLicense = (license: string, email: string) => {
  // Ajouter nouvelle logique de validation
  if (license === 'NOUVELLE-CLE-2025') {
    // Configuration de la nouvelle licence
  }
};
```

2. **Définir les fonctionnalités** disponibles pour chaque type de licence

3. **Ajouter des restrictions** dans les composants concernés

### Intégration serveur (futur)

Le système peut facilement être étendu pour valider les licences côté serveur:

```typescript
const validateLicenseServer = async (license: string, email: string) => {
  const response = await fetch('/api/validate-license', {
    method: 'POST',
    body: JSON.stringify({ license, email })
  });
  return response.json();
};
```

## Sécurité

### Mesures actuelles
- Validation côté client avec stockage local
- Clés de démonstration avec expiration
- Vérification des fonctionnalités à l'exécution

### Amélirations recommandées
- Validation serveur pour les licences production
- Chiffrement des clés de licence
- Système de révocation des licences
- Audit des accès et utilisation

## Support et contact

Pour obtenir une licence ou pour toute question:
- **Email**: contact@tawjeehexplorer.com
- **Sujet**: Demande de licence TawjeehExplorer

## Changelog

### Version 1.0 (Actuelle)
- ✅ Système de validation basique
- ✅ Licence de démonstration
- ✅ Protection des exports
- ✅ Interface de gestion
- ✅ Persistance locale

### Roadmap
- 🔄 Validation serveur
- 🔄 Licences à durée limitée
- 🔄 Système de paiement intégré
- 🔄 Analytics d'utilisation
- 🔄 API de gestion des licences
