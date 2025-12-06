# CouchDB GUI Client

[🇫🇷 Version française](#version-française) | [🇬🇧 English version](#english-version)

---

## Version française

### 📋 Description

CouchDB GUI Client est une interface web moderne et intuitive pour gérer vos bases de données CouchDB. Cette application a été spécialement conçue pour fonctionner en tandem avec [ClearDoc](https://github.com/yourusername/ClearDoc), offrant une solution complète pour la gestion et l'édition de documents structurés.

### ✨ Fonctionnalités principales

- **🔐 Connexion sécurisée** : Support des connexions HTTP/HTTPS avec authentification
- **📝 Double mode d'édition** :
  - Mode JSON avec coloration syntaxique (Monaco Editor)
  - Mode formulaire simplifié pour les utilisateurs non-techniques
- **🔄 Gestion complète des documents** : Création, lecture, modification et suppression (CRUD)
- **🎯 Auto-incrémentation des IDs** : Génération automatique d'identifiants pour les nouveaux items
- **💾 Sauvegarde sécurisée** : Préservation automatique des champs `_id` et `_rev`
- **🎨 Interface moderne** : Design responsive avec thème sombre/clair

### 🖼️ Captures d'écran

#### Connexion à CouchDB
![Connexion](https://filerise.emanuelvigreux.fr/api/file/share.php?token=87784f1286434a553944882ddf60d40e)

#### Liste des documents
![Liste des documents](https://filerise.emanuelvigreux.fr/api/file/share.php?token=32e3fa0746815f8bd34c16bfe1f0daf2)

#### Éditeur JSON
![Éditeur JSON](https://filerise.emanuelvigreux.fr/api/file/share.php?token=66a567c6ad86f961d28e7dac7755e518)

#### Mode formulaire
![Mode formulaire](https://filerise.emanuelvigreux.fr/api/file/share.php?token=b192cbc03beca76c85d353801c8e61c8)

### 🚀 Installation

1. Clonez le repository :
```bash
git clone https://github.com/yourusername/couchdb-gui-client.git
cd couchdb-gui-client
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application en mode développement :
```bash
npm run dev
```

4. Ouvrez votre navigateur à l'adresse : `http://localhost:5173`

### 🔧 Configuration

#### Connexion à CouchDB

⚠️ **Important** : L'URL du serveur ne doit PAS contenir le protocole (http:// ou https://)

1. **URL du serveur** : 
   - Format : `serveur:port` ou `domaine.com:port`
   - Exemples : `localhost:5984`, `db.monsite.com:5984`
   - ❌ Incorrect : `http://localhost:5984`
   - ✅ Correct : `localhost:5984`

2. **Base de données** : Nom exact de votre base de données CouchDB

3. **Nom d'utilisateur** : Votre identifiant CouchDB

4. **Mot de passe** : Votre mot de passe CouchDB

5. **Connexion SSL** : 
   - Cochez cette option si votre serveur utilise HTTPS
   - Le protocole sera automatiquement déterminé selon cette option

#### Structure des documents

L'application est optimisée pour gérer des documents avec la structure suivante :

```json
{
  "_id": "identifiant_unique",
  "_rev": "revision_couchdb",
  "items": [
    {
      "id": "1",
      "title": "Titre de l'item",
      "description": "Description détaillée",
      "imageUrl": "https://example.com/image.jpg",
      "category": "Catégorie",
      "keywords": ["mot-clé1", "mot-clé2", "mot-clé3"]
    }
  ]
}
```

### 🔗 Intégration avec ClearDoc

Cette application est conçue pour fonctionner en synergie avec [ClearDoc](https://github.com/yourusername/ClearDoc), une application de gestion documentaire avancée. 

**Workflow recommandé :**
1. Utilisez ClearDoc pour organiser et catégoriser vos documents
2. Utilisez CouchDB GUI Client pour éditer et maintenir la structure des données
3. Les deux applications partagent la même base de données CouchDB

### 🛠️ Technologies utilisées

- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **TailwindCSS** pour le styling
- **Monaco Editor** pour l'édition JSON
- **Lucide React** pour les icônes
- **CryptoJS** pour le chiffrement des credentials

### 📝 Licence

MIT

---

## English Version

### 📋 Description

CouchDB GUI Client is a modern and intuitive web interface for managing your CouchDB databases. This application has been specially designed to work in tandem with [ClearDoc](https://github.com/yourusername/ClearDoc), offering a complete solution for managing and editing structured documents.

### ✨ Main Features

- **🔐 Secure connection**: HTTP/HTTPS support with authentication
- **📝 Dual editing mode**:
  - JSON mode with syntax highlighting (Monaco Editor)
  - Simplified form mode for non-technical users
- **🔄 Complete document management**: Create, Read, Update, Delete (CRUD)
- **🎯 Auto-incrementing IDs**: Automatic ID generation for new items
- **💾 Secure saving**: Automatic preservation of `_id` and `_rev` fields
- **🎨 Modern interface**: Responsive design with dark/light theme

### 🖼️ Screenshots

#### CouchDB Connection
![Connection](https://filerise.emanuelvigreux.fr/api/file/share.php?token=87784f1286434a553944882ddf60d40e)

#### Document List
![Document List](https://filerise.emanuelvigreux.fr/api/file/share.php?token=32e3fa0746815f8bd34c16bfe1f0daf2)

#### JSON Editor
![JSON Editor](https://filerise.emanuelvigreux.fr/api/file/share.php?token=66a567c6ad86f961d28e7dac7755e518)

#### Form Mode
![Form Mode](https://filerise.emanuelvigreux.fr/api/file/share.php?token=b192cbc03beca76c85d353801c8e61c8)

### 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/couchdb-gui-client.git
cd couchdb-gui-client
```

2. Install dependencies:
```bash
npm install
```

3. Start the application in development mode:
```bash
npm run dev
```

4. Open your browser at: `http://localhost:5173`

### 🔧 Configuration

#### CouchDB Connection

⚠️ **Important**: The server URL must NOT contain the protocol (http:// or https://)

1. **Server URL**: 
   - Format: `server:port` or `domain.com:port`
   - Examples: `localhost:5984`, `db.mysite.com:5984`
   - ❌ Incorrect: `http://localhost:5984`
   - ✅ Correct: `localhost:5984`

2. **Database**: Exact name of your CouchDB database

3. **Username**: Your CouchDB username

4. **Password**: Your CouchDB password

5. **SSL Connection**: 
   - Check this option if your server uses HTTPS
   - The protocol will be automatically determined based on this option

#### Document Structure

The application is optimized to manage documents with the following structure:

```json
{
  "_id": "unique_identifier",
  "_rev": "couchdb_revision",
  "items": [
    {
      "id": "1",
      "title": "Item title",
      "description": "Detailed description",
      "imageUrl": "https://example.com/image.jpg",
      "category": "Category",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}
```

### 🔗 Integration with ClearDoc

This application is designed to work in synergy with [ClearDoc](https://github.com/yourusername/ClearDoc), an advanced document management application.

**Recommended workflow:**
1. Use ClearDoc to organize and categorize your documents
2. Use CouchDB GUI Client to edit and maintain data structure
3. Both applications share the same CouchDB database

### 🛠️ Technologies Used

- **React 18** with TypeScript
- **Vite** for build and development
- **TailwindCSS** for styling
- **Monaco Editor** for JSON editing
- **Lucide React** for icons
- **CryptoJS** for credential encryption

### 📝 License

MIT

---

## 👥 Contributors

- [Your Name](https://github.com/yourusername)

## 🐛 Bug Reports

If you find a bug, please open an issue on [GitHub Issues](https://github.com/yourusername/couchdb-gui-client/issues)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
