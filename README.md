# Server Monitoring & Learning Portal

A professional Node.js application featuring a centralized management portal with integrated AWS server monitoring and activity logging.

## Features

- **User Management**: Secure student and admin roles using `bcrypt` and `express-session`.
- **AWS Monitoring API**: Centralized endpoints to pull real-time server load (CPU) and login activity.
- **Production Hardened**: Integrated with `helmet.js` for secure headers and sanitized input paths.
- **Activity Logging**: Automated tracking of all login events and IP addresses.
- **Course System**: A fully functional learning resource catalog.

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Session Management**: express-session
- **Password Hashing**: bcrypt

## Installation

### Prerequisites

- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- **Either:**
  - **Supabase Account** (Recommended - Free cloud database) - [Sign up here](https://supabase.com)
  - **OR Local PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)

### Quick Start with Supabase (Recommended)

**This is the easiest way to get started - no local database installation needed!**

1. **Create Supabase Project**
   - Go to https://supabase.com and sign up
   - Create a new project
   - See detailed instructions in [SUPABASE_SETUP.md](file:///d:/Website/SUPABASE_SETUP.md)

2. **Clone and Install**
   ```bash
   cd d:\Website
   npm install
   ```

3. **Configure Environment**
   ```bash
   # Copy the example file
   copy .env.example .env
   
   # Edit .env and add your Supabase credentials
   # Get these from: Supabase Dashboard → Settings → Database
   ```

4. **Set Up Database**
   - In Supabase Dashboard, go to SQL Editor
   - Copy contents of `database/schema.sql` and run it
   - Copy contents of `database/seed.sql` and run it

5. **Start the Server**
   ```bash
   npm start
   ```

6. **Access the Application**
   - Open browser to `http://localhost:3000`

**For detailed Supabase setup instructions, see [SUPABASE_SETUP.md](file:///d:/Website/SUPABASE_SETUP.md)**

### Alternative: Local PostgreSQL Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd d:\Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Edit `.env` file with your database credentials
   - Update `DB_PASSWORD` and other settings as needed

4. **Set up the database**
   ```bash
   # Create database
   psql -U postgres -c "CREATE DATABASE learning_portal;"
   
   # Run schema
   psql -U postgres -d learning_portal -f database/schema.sql
   
   # Seed data
   psql -U postgres -d learning_portal -f database/seed.sql
   ```

5. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Open browser to `http://localhost:3000`

## Default Accounts

### Student Account
- Username: `student1`
- Password: `password123`

### Admin Account
- Username: `admin`
- Password: `admin123`

## Attack Simulation

The project includes attack simulation scripts for testing:

### DDoS Simulation
```bash
node attack-simulations/ddos.js
```
Simulates high-frequency requests to test rate limiting and DDoS detection.

### Brute Force Simulation
```bash
node attack-simulations/bruteforce.js
```
Tests login brute force detection with common username/password combinations.

### SQL Injection Simulation
```bash
node attack-simulations/sqli.js
```
Tests SQL injection vulnerabilities in search and course endpoints.

### XSS Simulation
```bash
node attack-simulations/xss.js
```
Tests stored XSS vulnerabilities in comment sections.

### Directory Traversal Simulation
```bash
node attack-simulations/traversal.js
```
Tests path traversal vulnerabilities in file access.

## Intentional Vulnerabilities

This application includes the following intentional security flaws:

1. **SQL Injection**
   - `/api/search` endpoint (primary target)
   - `/api/courses/:id` endpoint

2. **Cross-Site Scripting (XSS)**
   - Comment posting (stored XSS)
   - No input sanitization

3. **Directory Traversal**
   - Course ID parameter manipulation

4. **Weak Authentication**
   - No rate limiting on login attempts
   - Simple password requirements

## Security Logging

All requests are logged to the `security_logs` table with:
- IP address and user agent
- Request/response metadata
- Pattern detection (XSS, SQLi, traversal)
- Request frequency metrics
- Anomaly scores (populated by ML model)

### Viewing Logs

Access the admin dashboard at `/admin/dashboard` to view:
- Recent security events
- Flagged requests
- Attack pattern detection

Or query directly:
```sql
SELECT * FROM security_logs 
WHERE xss_patterns_detected = true 
   OR sql_injection_patterns_detected = true 
ORDER BY timestamp DESC 
LIMIT 50;
```

## ML/AI Integration

The application provides integration points for machine learning and AI systems:

1. **Feature Extraction**: Security logs contain structured data for ML models
2. **Prediction Endpoint**: Stub for ML service integration in `middleware/securityLogger.js`
3. **Automated Response**: Framework for AI-driven defense actions

### Integration Flow

```
Request → Security Logger → Database
                ↓
         ML Service (external)
                ↓
         AI Decision Agent
                ↓
         Automated Response
```

## Project Structure

```
d:\Website\
├── server.js                 # Main application entry
├── package.json              # Dependencies
├── .env                      # Environment configuration
├── database/
│   ├── db.js                # Database connection
│   ├── schema.sql           # Database schema
│   └── seed.sql             # Sample data
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── securityLogger.js    # Security logging
│   └── requestFrequency.js  # Request tracking
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── public.js            # Public API routes
│   ├── student.js           # Student features
│   └── admin.js             # Admin features
├── public/
│   ├── css/
│   │   └── style.css        # Styling
│   ├── js/
│   │   └── main.js          # Client utilities
│   └── *.html               # Frontend pages
└── attack-simulations/
    ├── ddos.js              # DDoS simulation
    ├── bruteforce.js        # Brute force simulation
    ├── sqli.js              # SQL injection simulation
    ├── xss.js               # XSS simulation
    └── traversal.js         # Directory traversal simulation
```

## Deployment

### Cloud Deployment with Supabase

The application is ready for cloud deployment using Supabase as the database.

**Quick Deploy Options:**
- **Vercel** (Recommended): `vercel` - See [DEPLOYMENT.md](file:///d:/Website/DEPLOYMENT.md)
- **Netlify**: `netlify deploy --prod`
- **Railway**: Connect GitHub repository
- **Render**: Connect GitHub repository
- **AWS EC2**: Traditional server deployment

**Complete deployment instructions for all platforms:** [DEPLOYMENT.md](file:///d:/Website/DEPLOYMENT.md)

### Prerequisites for Deployment

1. ✅ Supabase project created (see [SUPABASE_SETUP.md](file:///d:/Website/SUPABASE_SETUP.md))
2. ✅ Database schema and seed data loaded
3. ✅ Environment variables configured
4. ✅ Application tested locally

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon for automatic server restart on file changes.

### Database Migrations

To reset the database:
```bash
psql -U postgres -d learning_portal -f database/schema.sql
psql -U postgres -d learning_portal -f database/seed.sql
```

## License

MIT License - For educational and testing purposes only.

## Support

This is a security testing environment. For questions or issues, refer to the technical design documentation.
