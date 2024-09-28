from backend import app,db, models


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        app.run()