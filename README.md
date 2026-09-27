# Syscom SEO Growth Hub

A full-stack SEO and content management platform designed to support Syscom's organic search growth, content publishing, technical SEO auditing, keyword planning, backlink management, directory management, and social content distribution.

## 1. Project Objective

The objective of this project is to build a web application that supports:

- Improved organic search visibility
- SEO-friendly content publishing
- Technical SEO auditing
- High-intent keyword planning
- Backlink opportunity management
- Directory listing management
- Social content distribution tracking
- Lead collection
- Long-term organic traffic growth

The application follows SEO-friendly development practices such as semantic HTML, metadata optimization, canonical URLs, structured data, internal linking, robots.txt, XML sitemap, mobile-friendly layouts, and secure backend APIs.

---

## 2. Key Features

### Public Website

- SEO-optimized homepage
- Services page
- Blog listing
- Dynamic article pages
- Contact/lead generation form
- SEO audit interface
- Custom 404 page
- Responsive design

### Content Management

- Create and manage articles
- Article categories
- Draft/published status
- SEO title and meta description
- SEO-friendly article slugs
- Dynamic article rendering

### SEO Management

- Technical SEO audit
- SEO score calculation
- Title analysis
- Meta description analysis
- Heading analysis
- Image alt-text analysis
- HTTPS check
- Viewport check
- Canonical check
- Robots check
- Internal link analysis

### Off-Page SEO Management

- Backlink opportunity tracking
- Directory listing management
- Keyword planning
- Search-intent classification
- Social post planning
- Social post publishing status
- Referral visit tracking

### Lead Management

- Contact form
- Lead storage
- Name, email, website, service and message fields
- Timestamped lead records

### Authentication

- JWT-based authentication
- Protected management APIs
- Admin/editor roles
- Password hashing using bcrypt

---

## 3. Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive UI
- JSON-LD structured data

### Backend

- Node.js
- Express.js
- MySQL
- mysql2
- JWT
- bcryptjs
- Helmet
- CORS
- Axios
- Cheerio

### Database

- MySQL

### Development Tools

- Git
- GitHub
- npm
- Nodemon

---

## 4. Project Structure

```text
syscom-seo-growth-hub/
│
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── Frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── services.html
│   ├── blog.html
│   ├── article.html
│   ├── contact.html
│   ├── seo-audit.html
│   ├── dashboard.html
│   ├── seo-management.html
│   ├── login.html
│   ├── 404.html
│   ├── robots.txt
│   └── sitemap.xml
│
├── database/
│   └── schema.sql
│
└── README.md
