# IdeaLab

A full-stack web application for idea management and collaboration, built with Django REST Framework (backend) and React (frontend).

## Features

- **User Authentication**: JWT-based authentication system
- **Idea Management**: Create, read, update, and delete ideas
- **Feedback System**: Comment on and provide feedback for ideas
- **Bookmarking**: Save favorite ideas for later
- **Analytics**: Track engagement and statistics
- **Notifications**: Real-time notifications for activities
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## Tech Stack

### Backend
- **Django 5.2** - Web framework
- **Django REST Framework** - API development
- **MySQL** - Database
- **JWT Authentication** - Token-based auth
- **Celery** - Background task processing
- **Redis** - Caching and message broker

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **Leaflet** - Interactive maps
- **Chart.js** - Data visualization

## Prerequisites

Before running this project, make sure you have the following installed:

- **Python 3.8+**
- **Node.js 18+**
- **MySQL Server**
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Yaasine-Dev/IdeaLab.git
cd IdeaLab
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv venv
```

#### Activate Virtual Environment
- **Windows:**
  ```bash
  venv\Scripts\activate
  ```
- **Linux/Mac:**
  ```bash
  source venv/bin/activate
  ```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Database Setup
1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE idealab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Update Database Configuration:**
   - Open `config/settings.py`
   - Modify the `DATABASES` configuration if your MySQL credentials differ:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'idealab',
           'USER': 'your_mysql_username',
           'PASSWORD': 'your_mysql_password',
           'HOST': '127.0.0.1',
           'PORT': '3306',
           'OPTIONS': {
               'charset': 'utf8mb4',
           },
       }
   }
   ```

#### Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend/idealab
npm install
```

## Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
# Activate virtual environment if not already activated
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

python manage.py runserver
```
Backend will be available at: http://127.0.0.1:8000

#### Start Frontend Server
```bash
cd frontend/idealab
npm run dev
```
Frontend will be available at: http://localhost:5173

### Production Build

#### Build Frontend
```bash
cd frontend/idealab
npm run build
```

#### Collect Static Files (Backend)
```bash
cd backend
python manage.py collectstatic
```

## API Documentation

When the backend server is running, API documentation is available at:
- **Swagger UI**: http://127.0.0.1:8000/api/schema/swagger-ui/
- **ReDoc**: http://127.0.0.1:8000/api/schema/redoc/
- **OpenAPI Schema**: http://127.0.0.1:8000/api/schema/

## Project Structure

```
IdeaLab/
├── backend/                    # Django backend
│   ├── accounts/              # User management app
│   ├── ideas/                 # Ideas management app
│   ├── feedbacks/             # Feedback system app
│   ├── comments/              # Comments app
│   ├── notifications/         # Notifications app
│   ├── bookmarks/             # Bookmarks app
│   ├── analytics/             # Analytics app
│   ├── config/                # Django settings and URLs
│   ├── manage.py
│   ├── requirements.txt
│   └── venv/                  # Virtual environment (created during setup)
├── frontend/                  # React frontend
│   └── idealab/
│       ├── public/            # Static assets
│       ├── src/               # React source code
│       │   ├── components/    # Reusable components
│       │   ├── pages/         # Page components
│       │   ├── hooks/         # Custom hooks
│       │   ├── utils/         # Utility functions
│       │   └── api/           # API integration
│       ├── package.json
│       └── vite.config.js
├── .gitignore
└── README.md
```

## Environment Variables

Create a `.env` file in the backend directory for sensitive configuration:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=mysql://user:password@localhost:3306/idealab
REDIS_URL=redis://localhost:6379
```

## Contributing

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests:**
   ```bash
   # Backend tests
   cd backend
   python manage.py test

   # Frontend tests (if implemented)
   cd frontend/idealab
   npm test
   ```
5. **Commit your changes:**
   ```bash
   git commit -m "Add your commit message"
   ```
6. **Push to the branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## Code Quality

### Backend
- Follow Django best practices
- Use Django REST Framework conventions
- Write comprehensive tests
- Use meaningful variable and function names

### Frontend
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Write clean, readable JSX

## Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Ensure MySQL server is running
   - Verify database credentials in `settings.py`
   - Check if database exists

2. **CORS Errors:**
   - Backend is configured to accept requests from `localhost:5173`
   - Ensure both servers are running on correct ports

3. **Module Not Found Errors:**
   - Ensure all dependencies are installed
   - Try deleting `node_modules` and running `npm install` again

4. **Port Already in Use:**
   - Kill processes using the ports or change port numbers
   - Backend: `python manage.py runserver 8001`
   - Frontend: `npm run dev -- --port 5174`

### Getting Help

If you encounter issues:
1. Check the API documentation
2. Review error messages in the console
3. Ensure all prerequisites are installed
4. Check that both servers are running

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Django REST Framework for the powerful API toolkit
- React ecosystem for the excellent frontend tools
- Tailwind CSS for the utility-first styling approach
- All contributors and maintainers of the open-source libraries used