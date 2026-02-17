# 📋 Task Manager - Application de Gestion de Tâches

Application full-stack moderne pour la gestion de tâches avec authentification JWT, développée avec **Spring Boot** (Backend) et **Angular 20** (Frontend).

---

##  Fonctionnalités

###  Gestion des Tâches
- Créer, modifier, supprimer des tâches
- Statuts : En cours, Terminé, Suspendu
- Date d'échéance
- Filtrage par statut
- Recherche par titre/description
- Tri et pagination

###  Authentification & Sécurité
- Inscription / Connexion avec JWT
- Gestion des rôles (USER, ADMIN, MODERATOR)
- Protection des routes
- Gestion de profil utilisateur
- Changement de mot de passe

###  Interface Utilisateur
- Design moderne avec Angular Material
- Interface responsive
- Animations fluides
- Notifications en temps réel

---

##  Technologies Utilisées

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** avec JWT
- **Spring Data JPA**
- **MySQL** / H2 Database
- **Maven**

### Frontend
- **Angular 20**
- **Angular Material**
- **RxJS**
- **TypeScript**
- **Reactive Forms**

---

##  Prérequis

- **Java JDK 17+**
- **Node.js 20+** et **npm**
- **MySQL 8.0+** (ou H2 pour développement)
- **Maven 3.8+**
- **Angular CLI 20+**

---

##  Installation

### 1️⃣ Cloner le repository
```bash
git clone https://github.com/adnangaidi/TaskManager.git
cd TaskManager
```

### 2️⃣ Backend (Spring Boot)

#### Configuration de la base de données

Éditez `src/main/resources/application.properties` :

**Pour MySQL :**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskdb?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

app.jwt.secret=7A25432A46294A404E635266556A586E3272357538782F413F4428472B4B6250645367566B597033733676397924422645294840
app.jwt.expiration-ms=86400000
```

**Pour H2 (développement) :**
```properties
spring.datasource.url=jdbc:h2:mem:taskdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

#### Lancer le backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Le serveur démarrera sur `http://localhost:8080`

### 3️⃣ Frontend (Angular)
```bash
cd frontend
npm install
ng serve
```

L'application sera accessible sur `http://localhost:4200`

---

##  Utilisateur par défaut

Après le premier lancement, un utilisateur admin est créé automatiquement :

- **Username :** `admin`
- **Password :** `admin1`
- **Email :** `admin@admin.com`

---

##  Utilisation

1. **Inscription** : Créez un compte via `/register`
2. **Connexion** : Connectez-vous avec vos identifiants
3. **Créer des tâches** : Cliquez sur "Nouvelle Tâche"
4. **Gérer les tâches** : Modifier, supprimer, changer le statut
5. **Profil** : Accédez à votre profil pour modifier vos informations

